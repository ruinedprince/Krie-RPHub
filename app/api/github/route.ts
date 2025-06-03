import { NextResponse } from 'next/server';

export async function GET() {
  const username = 'ruinedprince';
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      const error = await userRes.json();
      return NextResponse.json({ error: error.message || 'Erro ao buscar dados do GitHub' }, { status: userRes.status });
    }
    const user = await userRes.json();
    return NextResponse.json({
      avatar_url: user.avatar_url,
      login: user.login,
      name: user.name,
      bio: user.bio,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      html_url: user.html_url,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro inesperado ao buscar dados do GitHub' }, { status: 500 });
  }
}
