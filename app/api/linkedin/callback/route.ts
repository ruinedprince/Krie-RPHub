import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Code não encontrado' }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'http://localhost:3000/api/linkedin/callback');
  params.append('client_id', '7798zdw7q01v4o');
  params.append('client_secret', 'WPL_AP1.BtyiD0gtg04B6IGv.dskReA==');

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.json({ error: tokenData.error_description || 'Erro ao obter access_token' }, { status: 400 });
  }

  // Buscar dados do perfil
  const profileRes = await fetch('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await profileRes.json();

  // Buscar foto de perfil
  const pictureRes = await fetch('https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const pictureData = await pictureRes.json();
  let profilePictureUrl = null;
  try {
    const elements = pictureData.profilePicture['displayImage~'].elements;
    profilePictureUrl = elements[elements.length - 1].identifiers[0].identifier;
  } catch (e) {}

  return NextResponse.json({
    id: profile.id,
    firstName: profile.localizedFirstName,
    lastName: profile.localizedLastName,
    profilePictureUrl,
    headline: profile.headline || '',
  });
}
