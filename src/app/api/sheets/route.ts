import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tabName = searchParams.get('tab'); // e.g., 'Tasks', 'Budget'

  if (!tabName) {
    return NextResponse.json({ error: 'Tab name is required' }, { status: 400 });
  }

  try {
    const sheets = await getGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!A:Z`, // Grabs everything in the tab
    });

    const rows = response.data.values || [];
    
    // Convert 2D array (Sheets format) into Array of Objects (JSON format)
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      let obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tabName = searchParams.get('tab');

    if (!tabName) {
      return NextResponse.json({ error: 'Tab name is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // We expect the frontend to send an array of string values representing a row
    // Example: { "values": ["1696174265000", "01-Oct-2026", "Build API", "Personal", ...] }
    if (!body.values || !Array.isArray(body.values)) {
      return NextResponse.json({ error: 'Invalid data format. Expected { values: string[] }' }, { status: 400 });
    }

    const sheets = await getGoogleSheets();
    
    // Append the row to the specified tab
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!A:Z`,
      valueInputOption: 'USER_ENTERED', // Formats dates/numbers as if typed manually
      requestBody: {
        values: [body.values], // Must be an array of arrays (one array = one row)
      },
    });

    return NextResponse.json({ success: true, updatedRange: response.data.updates?.updatedRange });
    
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to append data' }, { status: 500 });
  }
}