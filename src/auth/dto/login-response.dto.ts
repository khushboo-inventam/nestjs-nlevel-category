/* eslint-disable camelcase */
export class Login {
  message: string;

  data: {
    public_id: string;
    fullname: string;
    email: string;
    bb_user_id: string | null;
    connected_to_bb: boolean;
    sync_at: string | null;
    access_token: string;
    refresh_token: string;
    already_logged_in: boolean;
    reset_password?: boolean;
  };
}
