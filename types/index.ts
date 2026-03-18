export interface CastMember {
  name: string;
  photo_url: string;
}

export interface Book {
  id: string;
  title: string;
  genre?: string | null;
  poster_url?: string | null;
  logo_url?: string | null;
  trailer_url?: string | null;
  buy_color_url?: string | null;
  buy_bw_url?: string | null;
  cast: CastMember[];
  description?: string | null;
  created_at: string;
}
