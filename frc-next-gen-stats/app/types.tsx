export interface TBAMatch {
  key: string;
  comp_level: string;
  set_number: number;
  match_number: number;
  time: number;
  alliances: {
    red: {
      score: number;
      team_keys: string[];
    };
    blue: {
      score: number;
      team_keys: string[];
    };
  };
  winning_alliance: string;
  event_key: string;
  event_name: string;
  real_time: string;
  official: boolean;
}

export interface TBAEvent {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  start_date: string;
  end_date: string;
  year: number;
  city: string;
  state_prov: string;
  country: string;
}