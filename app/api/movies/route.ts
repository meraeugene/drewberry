import { getMovie, getMovies, getMovieSuggestions } from "@/actions/movies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const suggestionsFor = searchParams.get("suggestionsFor");
  const query = searchParams.get("q") ?? undefined;

  if (suggestionsFor) {
    return Response.json(await getMovieSuggestions(suggestionsFor));
  }

  if (id) {
    const movie = await getMovie(id);
    return movie
      ? Response.json(movie)
      : Response.json({ message: "Movie not found" }, { status: 404 });
  }

  return Response.json(await getMovies(query));
}
