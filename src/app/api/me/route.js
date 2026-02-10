import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/me
 * Server-side route to retrieve the access token from httpOnly cookies
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      );
    }
    console.log("Retrieved access token from cookies:", accessToken.value);
    console.log("Retrieved access token from cookies:", accessToken);
    return NextResponse.json({
      token: accessToken.value
    });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
