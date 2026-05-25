type TmdbMovie = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: "movie" | "tv" | string;
};

type TmdbSearchResponse = {
  results: TmdbMovie[];
};

type HomeMovie = {
  id: string;
  title: string;
  overview: string;
  year: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
};

type HomeCategory = {
  title: string;
  queries: TmdbQuery[];
};

const imageBase = "https://image.tmdb.org/t/p";

type TmdbQuery =
  | string
  | {
      title: string;
      year?: string;
      media?: "movie" | "tv" | "multi";
    };

const popularQueries: TmdbQuery[] = [
  { title: "Barbie as The Princess and the Pauper", year: "2004" },
  { title: "Tinker Bell", year: "2008" },
  { title: "Barbie: Princess Charm School", year: "2011" },
  { title: "Winx Club: The Secret of the Lost Kingdom", year: "2007", media: "multi" },
  { title: "Legally Blonde", year: "2001" },
  { title: "Mean Girls", year: "2004" },
  { title: "The Princess Diaries", year: "2001" },
  { title: "13 Going on 30", year: "2004" },
  { title: "Clueless", year: "1995" },
  { title: "A Cinderella Story", year: "2004" },
  { title: "Barbie in the 12 Dancing Princesses", year: "2006" },
  { title: "Barbie as Rapunzel", year: "2002" },
  { title: "Barbie of Swan Lake", year: "2003" },
  { title: "Ella Enchanted", year: "2004" },
  { title: "The Devil Wears Prada", year: "2006" },
  { title: "Confessions of a Shopaholic", year: "2009" },
];

const collectionQueries = [
  {
    title: "Mermaid Vibes",
    query: "Barbie in A Mermaid Tale",
  },
  {
    title: "Fairy & Princess",
    query: "Barbie Fairytopia",
  },
  {
    title: "Romcom Favorites",
    query: "Legally Blonde",
  },
  {
    title: "Girl Power",
    query: "Mean Girls",
  },
  {
    title: "Royal Dreams",
    query: "The Princess Diaries",
  },
  {
    title: "Fashion Magic",
    query: "The Devil Wears Prada",
  },
  {
    title: "Sleepover Classics",
    query: "A Cinderella Story",
  },
  {
    title: "Pink Comedies",
    query: "Clueless",
  },
  {
    title: "Barbie Fairytales",
    query: "Barbie as Rapunzel",
  },
  {
    title: "Dance & Sparkle",
    query: "Barbie in the 12 Dancing Princesses",
  },
  {
    title: "Mall Day Picks",
    query: "Confessions of a Shopaholic",
  },
  {
    title: "Magic Kingdoms",
    query: "Barbie of Swan Lake",
  },
];

const extraMovieCategories: HomeCategory[] = [
  {
    title: "Pink Sleepover Picks",
    queries: [
      { title: "10 Things I Hate About You", year: "1999" },
      { title: "13 Going on 30", year: "2004" },
      { title: "17 Again", year: "2009" },
      { title: "27 Dresses", year: "2008" },
      { title: "A Cinderella Story", year: "2004" },
      { title: "What a Girl Wants", year: "2003" },
      { title: "Wild Child", year: "2008" },
      { title: "Monte Carlo", year: "2011" },
      { title: "She's the Man", year: "2006" },
      { title: "She's All That", year: "1999" },
      { title: "John Tucker Must Die", year: "2006" },
      { title: "Clueless", year: "1995" },
      { title: "The Parent Trap", year: "1998" },
      { title: "Crossroads", year: "2002" },
      { title: "White Chicks", year: "2004" },
      { title: "Uptown Girls", year: "2003" },
    ],
  },
  {
    title: "Romcom Diary",
    queries: [
      { title: "How to Lose a Guy in 10 Days", year: "2003" },
      { title: "Notting Hill", year: "1999" },
      { title: "Pretty Woman", year: "1990" },
      { title: "The Holiday", year: "2006" },
      { title: "Bride Wars", year: "2009" },
      { title: "Letters to Juliet", year: "2010" },
      { title: "Mamma Mia!", year: "2008" },
      { title: "Me Before You", year: "2016" },
      { title: "The Proposal", year: "2009" },
      { title: "Set It Up", year: "2018" },
      { title: "Anyone But You", year: "2023" },
      { title: "The Idea of You", year: "2024" },
      { title: "The Other Zoey", year: "2023" },
      { title: "Upgraded", year: "2024" },
      { title: "Always Be My Maybe", year: "2019" },
      { title: "Crazy Rich Asians", year: "2018" },
      { title: "Crazy, Stupid, Love.", year: "2011" },
      { title: "Friends with Benefits", year: "2011" },
      { title: "Just Go with It", year: "2011" },
      { title: "You've Got Mail", year: "1998" },
      { title: "When Harry Met Sally...", year: "1989" },
    ],
  },
  {
    title: "Heartbreak Shelf",
    queries: [
      { title: "The Notebook", year: "2004" },
      { title: "A Walk to Remember", year: "2002" },
      { title: "The Fault in Our Stars", year: "2014" },
      { title: "Five Feet Apart", year: "2019" },
      { title: "The Best of Me", year: "2014" },
      { title: "Love, Rosie", year: "2014" },
      { title: "Love & Other Drugs", year: "2010" },
      { title: "Love Actually", year: "2003" },
      { title: "One Day", year: "2011" },
      { title: "Serendipity", year: "2001" },
      { title: "The Sun Is Also a Star", year: "2019" },
      { title: "See You on Venus", year: "2023" },
      { title: "Turtles All the Way Down", year: "2024" },
      { title: "Before I Fall", year: "2017" },
      { title: "Before We Go", year: "2014" },
      { title: "The First Time", year: "2012" },
      { title: "The Half of It", year: "2020" },
      { title: "The Perks of Being a Wallflower", year: "2012" },
    ],
  },
  {
    title: "Soft Indie Romance",
    queries: [
      { title: "500 Days of Summer", year: "2009" },
      { title: "About Time", year: "2013" },
      { title: "All of Us Strangers", year: "2023" },
      { title: "American Honey", year: "2016" },
      { title: "As Tears Go By", year: "1988" },
      { title: "Atonement", year: "2007" },
      { title: "A Summer's Tale", year: "1996" },
      { title: "Before Sunrise", year: "1995" },
      { title: "Blue Valentine", year: "2010" },
      { title: "Bones and All", year: "2022" },
      { title: "Brokeback Mountain", year: "2005" },
      { title: "Call Me by Your Name", year: "2017" },
      { title: "Closer", year: "2004" },
      { title: "Eternal Sunshine of the Spotless Mind", year: "2004" },
      { title: "In the Mood for Love", year: "2000" },
      { title: "La La Land", year: "2016" },
      { title: "Lost in Translation", year: "2003" },
      { title: "Marriage Story", year: "2019" },
      { title: "Past Lives", year: "2023" },
      { title: "Portrait of a Lady on Fire", year: "2019" },
      { title: "The Worst Person in the World", year: "2021" },
    ],
  },
  {
    title: "Drama Favorites",
    queries: [
      { title: "A Bronx Tale", year: "1993" },
      { title: "Baggy Jean" },
      { title: "Beautiful Boy", year: "2018" },
      { title: "Black Swan", year: "2010" },
      { title: "Dead Poets Society", year: "1989" },
      { title: "Everything Everywhere All at Once", year: "2022" },
      { title: "The Florida Project", year: "2017" },
      { title: "Gia", year: "1998" },
      { title: "Girl, Interrupted", year: "1999" },
      { title: "Good Will Hunting", year: "1997" },
      { title: "If Anything Happens I Love You", year: "2020" },
      { title: "Juno", year: "2007" },
      { title: "Little Women", year: "2019" },
      { title: "Lords of Dogtown", year: "2005" },
      { title: "Marley & Me", year: "2008" },
      { title: "Meet Joe Black", year: "1998" },
      { title: "News from Home", year: "1977" },
      { title: "Pearl", year: "2022" },
      { title: "Se7en", year: "1995" },
      { title: "Stand by Me", year: "1986" },
      { title: "Waves", year: "2019" },
    ],
  },
  {
    title: "Teen Series & Classics",
    queries: [
      { title: "13 Reasons Why", media: "tv" },
      { title: "Gossip Girl", media: "tv" },
      { title: "Normal People", media: "tv" },
      { title: "The Summer I Turned Pretty", media: "tv" },
      { title: "Bend It Like Beckham", year: "2002" },
      { title: "Flipped", year: "2010" },
      { title: "Grease", year: "1978" },
      { title: "He's Just Not That Into You", year: "2009" },
      { title: "My Girl", year: "1991" },
      { title: "The Princess Bride", year: "1987" },
      { title: "The Princess Diaries", year: "2001" },
      { title: "The Intern", year: "2015" },
      { title: "The Devil Wears Prada", year: "2006" },
      { title: "The Place Beyond the Pines", year: "2012" },
      { title: "The Princess Diaries 2: Royal Engagement", year: "2004" },
      { title: "Bridget Jones's Diary", year: "2001" },
    ],
  },
  {
    title: "Movie Night Mix",
    queries: [
      { title: "Mr. & Mrs. Smith", year: "2005" },
      { title: "Mr. Peabody & Sherman", year: "2014" },
      { title: "New York or Nowhere" },
      { title: "Origin", year: "2023" },
      { title: "Pride & Prejudice", year: "2005" },
      { title: "Summertime", year: "2015" },
      { title: "The Intern", year: "2015" },
      { title: "The Princess Diaries", year: "2001" },
      { title: "The Proposal", year: "2009" },
      { title: "Wild Child", year: "2008" },
      { title: "What a Girl Wants", year: "2003" },
      { title: "White Chicks", year: "2004" },
      { title: "Legally Blonde", year: "2001" },
      { title: "Mean Girls", year: "2004" },
      { title: "Ella Enchanted", year: "2004" },
      { title: "Me Before You", year: "2016" },
      { title: "17 Again", year: "2009" },
      { title: "Letters to Juliet", year: "2010" },
    ],
  },
];

const categoryQueries: HomeCategory[] = [
  {
    title: "Classic Barbies",
    queries: [
      { title: "Barbie in the Nutcracker", year: "2001" },
      { title: "Barbie as Rapunzel", year: "2002" },
      { title: "Barbie of Swan Lake", year: "2003" },
      { title: "Barbie as The Princess and the Pauper", year: "2004" },
      { title: "Barbie: Fairytopia", year: "2005" },
      { title: "Barbie and the Magic of Pegasus", year: "2005" },
      { title: "Barbie in the 12 Dancing Princesses", year: "2006" },
      { title: "Barbie as the Island Princess", year: "2007" },
    ],
  },
  {
    title: "Tinker Bell",
    queries: [
      { title: "Tinker Bell", year: "2008" },
      { title: "Tinker Bell and the Lost Treasure", year: "2009" },
      { title: "Tinker Bell and the Great Fairy Rescue", year: "2010" },
      { title: "Secret of the Wings", year: "2012" },
      { title: "The Pirate Fairy", year: "2014" },
      { title: "Tinker Bell and the Legend of the NeverBeast", year: "2014" },
    ],
  },
  {
    title: "Princess Charm School",
    queries: [
      { title: "Barbie: Princess Charm School", year: "2011" },
      { title: "The Princess Diaries", year: "2001" },
      { title: "The Princess Diaries 2: Royal Engagement", year: "2004" },
      { title: "Another Cinderella Story", year: "2008" },
      { title: "A Cinderella Story", year: "2004" },
      { title: "Ella Enchanted", year: "2004" },
    ],
  },
  {
    title: "Winx Club",
    queries: [
      { title: "Winx Club", media: "multi" },
      { title: "Winx Club: The Secret of the Lost Kingdom", year: "2007", media: "multi" },
      { title: "Winx Club 3D: Magic Adventure", year: "2010", media: "multi" },
      { title: "Winx Club: The Mystery of the Abyss", year: "2014", media: "multi" },
      { title: "PopPixie", media: "multi" },
      { title: "World of Winx", media: "multi" },
    ],
  },
  {
    title: "Girls Movie",
    queries: [
      { title: "Mean Girls", year: "2004" },
      { title: "Legally Blonde", year: "2001" },
      { title: "Clueless", year: "1995" },
      { title: "The Princess Diaries", year: "2001" },
      { title: "13 Going on 30", year: "2004" },
      { title: "Aquamarine", year: "2006" },
      { title: "Sleepover", year: "2004" },
      { title: "She's the Man", year: "2006" },
    ],
  },
  {
    title: "Legally Blonde & Mean Girls",
    queries: [
      { title: "Legally Blonde", year: "2001" },
      { title: "Legally Blonde 2: Red, White & Blonde", year: "2003" },
      { title: "Legally Blondes", year: "2009" },
      { title: "Mean Girls", year: "2004" },
      { title: "Mean Girls 2", year: "2011" },
      { title: "Mean Girls", year: "2024" },
    ],
  },
  {
    title: "Romcoms",
    queries: [
      { title: "13 Going on 30", year: "2004" },
      { title: "A Cinderella Story", year: "2004" },
      { title: "The Prince & Me", year: "2004" },
      { title: "Confessions of a Shopaholic", year: "2009" },
      { title: "The Devil Wears Prada", year: "2006" },
      { title: "How to Lose a Guy in 10 Days", year: "2003" },
      { title: "What a Girl Wants", year: "2003" },
      { title: "Just My Luck", year: "2006" },
    ],
  },
  {
    title: "2001 - 2014 Barbies",
    queries: [
      { title: "Barbie in the Nutcracker", year: "2001" },
      { title: "Barbie as Rapunzel", year: "2002" },
      { title: "Barbie of Swan Lake", year: "2003" },
      { title: "Barbie as The Princess and the Pauper", year: "2004" },
      { title: "Barbie: Fairytopia", year: "2005" },
      { title: "Barbie in the 12 Dancing Princesses", year: "2006" },
      { title: "Barbie and the Diamond Castle", year: "2008" },
      { title: "Barbie: Princess Charm School", year: "2011" },
      { title: "Barbie: The Pearl Princess", year: "2014" },
    ],
  },
  ...extraMovieCategories,
];

function getQueryTitle(query: TmdbQuery) {
  return typeof query === "string" ? query : query.title;
}

function getQueryYear(query: TmdbQuery) {
  return typeof query === "string" ? undefined : query.year;
}

function getQueryMedia(query: TmdbQuery) {
  return typeof query === "string" ? "movie" : query.media ?? "movie";
}

function getResultMedia(movie: TmdbMovie, query?: TmdbQuery) {
  if (movie.media_type === "tv" || movie.media_type === "movie") {
    return movie.media_type;
  }

  return getQueryMedia(query ?? "movie") === "tv" ? "tv" : "movie";
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getMovieYear(movie: TmdbMovie) {
  const date = movie.release_date ?? movie.first_air_date ?? "";

  return date ? date.slice(0, 4) : "";
}

function scoreResult(movie: TmdbMovie, query: TmdbQuery) {
  const queryTitle = normalizeTitle(getQueryTitle(query));
  const resultTitle = normalizeTitle(movie.title ?? movie.name ?? "");
  const queryYear = getQueryYear(query);
  const resultYear = getMovieYear(movie);
  let score = 0;

  if (!movie.poster_path) score -= 100;
  if (resultTitle === queryTitle) score += 80;
  if (resultTitle.startsWith(queryTitle) || queryTitle.startsWith(resultTitle)) {
    score += 24;
  }
  if (queryYear && resultYear === queryYear) score += 50;
  if (queryYear && resultYear && resultYear !== queryYear) score -= 24;
  const expectedMedia = getQueryMedia(query);

  if (
    expectedMedia !== "multi" &&
    movie.media_type &&
    movie.media_type !== expectedMedia
  ) {
    score -= 80;
  }
  if (movie.media_type === "movie" || movie.media_type === "tv" || !movie.media_type) {
    score += 8;
  }
  score += Math.min(movie.vote_average, 10);

  return score;
}

function fallbackMovie(query: TmdbQuery, index: number): HomeMovie {
  const title = getQueryTitle(query);

  return {
    id: `fallback-${Math.abs(
      Array.from(title).reduce((total, character) => total + character.charCodeAt(0), index + 1),
    )}`,
    title,
    overview: "A dreamy movie-night pick with friendship, style, and sparkle.",
    year: getQueryYear(query) ?? "Girls World",
    rating: 0,
    posterUrl: `https://placehold.co/780x1170/f9a8d4/831843.png?text=${encodeURIComponent(title)}`,
    backdropUrl: `https://placehold.co/1280x720/fbcfe8/831843.png?text=${encodeURIComponent(title)}`,
  };
}

const fallbackMovies: HomeMovie[] = popularQueries.map((query, index) => fallbackMovie(query, index));

function getTmdbHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) return undefined;

  return {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
}

function withApiKey(url: URL) {
  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey && !process.env.TMDB_ACCESS_TOKEN) {
    url.searchParams.set("api_key", apiKey);
  }

  return url;
}

async function searchMovie(query: TmdbQuery, index = 0) {
  const media = getQueryMedia(query);
  const url = withApiKey(new URL(`https://api.themoviedb.org/3/search/${media}`));
  url.searchParams.set("query", getQueryTitle(query));
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", "1");

  const year = getQueryYear(query);
  if (year && media === "movie") {
    url.searchParams.set("year", year);
  }
  if (year && media === "tv") {
    url.searchParams.set("first_air_date_year", year);
  }

  const response = await fetch(url, {
    headers: getTmdbHeaders(),
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    return fallbackMovie(query, index);
  }

  const data = (await response.json()) as TmdbSearchResponse;
  const result = data.results
    .filter(
      (movie) =>
        movie.poster_path &&
        (!movie.media_type ||
          movie.media_type === "movie" ||
          movie.media_type === "tv"),
    )
    .sort((first, second) => scoreResult(second, query) - scoreResult(first, query))[0];

  return result ? mapMovie(result, query) : fallbackMovie(query, index);
}

function mapMovie(movie: TmdbMovie, query?: TmdbQuery): HomeMovie {
  const title = movie.title ?? movie.name ?? "Untitled";
  const date = movie.release_date ?? movie.first_air_date ?? "";
  const media = getResultMedia(movie, query);

  return {
    id: `${media}-${movie.id}`,
    title,
    overview: movie.overview,
    year: date ? date.slice(0, 4) : "",
    rating: Number(movie.vote_average.toFixed(1)),
    posterUrl: movie.poster_path
      ? `${imageBase}/w780${movie.poster_path}`
      : `https://placehold.co/780x1170/f9a8d4/831843.png?text=${encodeURIComponent(title)}`,
    backdropUrl: movie.backdrop_path
      ? `${imageBase}/w1280${movie.backdrop_path}`
      : `https://placehold.co/1280x720/fbcfe8/831843.png?text=${encodeURIComponent(title)}`,
  };
}

export async function GET() {
  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) {
    return Response.json(
      {
        source: "fallback",
        missingKey: true,
        popular: fallbackMovies,
        hero: fallbackMovies.slice(0, 4),
        categories: categoryQueries.map((category, index) => ({
          title: category.title,
          movies: category.queries.map((query, queryIndex) => fallbackMovie(query, index * 20 + queryIndex)),
        })),
        collections: collectionQueries.map((collection, index) => ({
          title: collection.title,
          movie: fallbackMovies[index],
        })),
      },
      { status: 200 },
    );
  }

  try {
    const [popularResults, collectionResults, categoryResults] = await Promise.all([
      Promise.all(popularQueries.map(searchMovie)),
      Promise.all(collectionQueries.map((collection, index) => searchMovie(collection.query, index))),
      Promise.all(
        categoryQueries.map(async (category) => ({
          title: category.title,
          movies: await Promise.all(category.queries.map(searchMovie)),
        })),
      ),
    ]);

    const popular = popularResults;
    const collectionMovies = collectionResults;

    return Response.json({
      source: "tmdb",
      missingKey: false,
      popular,
      hero: popular.slice(0, 4),
      categories: categoryResults,
      collections: collectionQueries.map((collection, index) => ({
        title: collection.title,
        movie: collectionMovies[index] ?? popular[index],
      })),
    });
  } catch {
    return Response.json(
      {
        source: "fallback",
        missingKey: false,
        popular: fallbackMovies,
        hero: fallbackMovies.slice(0, 4),
        categories: categoryQueries.map((category, index) => ({
          title: category.title,
          movies: category.queries.map((query, queryIndex) => fallbackMovie(query, index * 20 + queryIndex)),
        })),
        collections: collectionQueries.map((collection, index) => ({
          title: collection.title,
          movie: fallbackMovies[index],
        })),
      },
      { status: 200 },
    );
  }
}
