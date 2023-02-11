export interface PageMoviesSeriesActors {
  page: number;
  results: MoviesSeriesActors[];
  total_pages: number;
  total_results: number;
}

export interface MoviesSeriesActors extends MoviesSeriesActorsBase {
  original_language: OriginalLanguage;
  original_title?: string;
  overview: string;
  vote_count: number;
  adult?: boolean;
  backdrop_path: string;
  genre_ids: number[];
  video?: boolean;
  popularity: number;
  media_type: MediaType;
  original_name?: string;
  origin_country?: string[];
  first_air_date?: Date;
  added?: boolean;
}
export interface MoviesSeriesActorsBase {
  poster_path: string;
  title?: string;
  id: number;
  vote_average: number;
  name?: string;
  idGlobal?: string;
}
export interface MoviesSeriesActorsUser extends MoviesSeriesActorsBase {
  idGlobal: string;
}
export enum MediaType {
  Movie = 'movie',
  Tv = 'tv',
  Person = 'person',
}

export enum OriginalLanguage {
  En = 'en',
  Ja = 'ja',
}
export interface Movie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name?: string;
  iso_639_1: string;
  name: string;
}

export interface TvShow {
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: Date;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: Date;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air: null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Network[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface LastEpisodeToAir {
  air_date: Date;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface Network {
  name: string;
  id: number;
  logo_path: null | string;
  origin_country: string;
}

export interface Season {
  air_date: Date;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
