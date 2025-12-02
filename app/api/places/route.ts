import { NextRequest, NextResponse } from 'next/server';

const OS_PLACES_API_KEY = process.env.OS_PLACES_API_KEY;
const OS_PLACES_API_URL = 'https://api.os.uk/search/places/v1/find';

interface OSPlacesResult {
  DPA?: {
    ADDRESS: string;
    POST_TOWN?: string;
    POSTCODE?: string;
    LOCAL_CUSTODIAN_CODE_DESCRIPTION?: string;
  };
}

interface OSPlacesResponse {
  results?: OSPlacesResult[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  if (!OS_PLACES_API_KEY) {
    console.error('OS_PLACES_API_KEY is not configured');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const apiUrl = new URL(OS_PLACES_API_URL);
    apiUrl.searchParams.set('query', query);
    apiUrl.searchParams.set('key', OS_PLACES_API_KEY);
    apiUrl.searchParams.set('maxresults', '10');
    apiUrl.searchParams.set('output_srs', 'EPSG:4326');

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('OS Places API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch suggestions' },
        { status: response.status }
      );
    }

    const data: OSPlacesResponse = await response.json();
    
    // Extract unique location suggestions (town, postcode, region)
    const suggestionsSet = new Set<string>();
    const suggestions: string[] = [];

    if (data.results) {
      for (const result of data.results) {
        if (result.DPA) {
          // Add post town if available
          if (result.DPA.POST_TOWN && !suggestionsSet.has(result.DPA.POST_TOWN)) {
            suggestionsSet.add(result.DPA.POST_TOWN);
            suggestions.push(result.DPA.POST_TOWN);
          }
          // Add postcode if available
          if (result.DPA.POSTCODE && !suggestionsSet.has(result.DPA.POSTCODE)) {
            suggestionsSet.add(result.DPA.POSTCODE);
            suggestions.push(result.DPA.POSTCODE);
          }
          // Add region/local authority if available
          if (result.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION && 
              !suggestionsSet.has(result.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION)) {
            suggestionsSet.add(result.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION);
            suggestions.push(result.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION);
          }
        }
      }
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    console.error('Error fetching from OS Places API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
