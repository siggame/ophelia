-- Drop all tables to get a fresh start
DROP TABLE IF EXISTS "competition" CASCADE;
DROP TABLE IF EXISTS "game" CASCADE;
DROP TABLE IF EXISTS "invitation" CASCADE;
DROP TABLE IF EXISTS "registration" CASCADE;
DROP TABLE IF EXISTS "team" CASCADE
DROP TABLE IF EXISTS "user" CASCADE;

-- Create enums
CREATE TYPE shirt_size_enum AS ENUM (
    'S', 'M', 'L', 'XL', 'XXL'
);

CREATE TYPE pizza_choice_enum AS ENUM (
    'Cheese', 'Pepperoni', 'Bacon'
);

CREATE TYPE client_language_enum AS ENUM (
    'cpp', 'js', 'lua', 'py', 'cs', 'java'
);

CREATE TYPE invitation_response_enum AS ENUM (
    'accepted', 'declined'
);

-- Create tables
CREATE TABLE competition
(
  id serial NOT NULL,
  name character varying(64) NOT NULL,
  cost integer,
  description character varying(64),
  image bytea,
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  is_open boolean,
  is_running boolean,
  min_num_team_members integer,
  max_num_team_members integer, --
  CONSTRAINT competition_pk PRIMARY KEY (id),
  CONSTRAINT competition_name_is_unique UNIQUE (name)
);

CREATE TABLE game
(
  id serial NOT NULL,
  competition integer,
  created timestamp without time zone,
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  status character varying(64),
  winner integer,
  loser integer,
  win_reason character varying(64),
  lose_reason character varying(64),
  tie_or_fail_reason character varying(64),
  is_tied boolean,
  extra_data json,
  CONSTRAINT game_pk PRIMARY KEY (id),
  CONSTRAINT game_competition_fk FOREIGN KEY (competition)
      REFERENCES competition (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT game_loser_fk FOREIGN KEY (loser)
      REFERENCES team (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT game_winner_fk FOREIGN KEY (winner)
      REFERENCES team (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE invitation
(
  team integer,
  sender integer,
  receiver integer,
  message character varying(140),
  id serial NOT NULL,
  time_sent timestamp without time zone,
  is_read boolean,
  response invitation_response_enum,
  CONSTRAINT invitation_pk PRIMARY KEY (id),
  CONSTRAINT invitation_receiver_fk FOREIGN KEY (receiver)
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT invitation_sender_fk FOREIGN KEY (sender)
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT invitation_team_fk FOREIGN KEY (team)
      REFERENCES team (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE registration
(
  id serial NOT NULL,
  "user" integer,
  competition integer,
  signup_date timestamp without time zone,
  is_active boolean,
  CONSTRAINT registration_pk PRIMARY KEY (id),
  CONSTRAINT registration_competition_fk FOREIGN KEY (competition)
      REFERENCES competition (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT registration_user_fk FOREIGN KEY ("user")
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE team
(
  id serial NOT NULL,
  name character varying(64) NOT NULL,
  gitlab_id integer,
  language client_language_enum,
  is_paid boolean,
  time_paid timestamp without time zone,
  created timestamp without time zone,
  is_eligible_to_win boolean,
  is_embargoed boolean,
  embargo_reason character varying(64),
  competition integer,
  CONSTRAINT team_pk PRIMARY KEY (id),
  CONSTRAINT team_competition_fk FOREIGN KEY (competition)
      REFERENCES competition (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT gitlab_id_is_unique UNIQUE (gitlab_id),
  CONSTRAINT name_is_unique UNIQUE (name)
);

CREATE TABLE "user"
(
  name character varying(32),
  username character varying(32) NOT NULL,
  email character varying(64),
  is_dev boolean,
  is_full_time_student boolean,
  is_sponsor boolean,
  id serial NOT NULL,
  is_previous_competitor boolean,
  shirt_size shirt_size_enum,
  pizza_choice pizza_choice_enum,
  team integer,
  CONSTRAINT user_pk PRIMARY KEY (id),
  CONSTRAINT user_team_fk FOREIGN KEY (team)
      REFERENCES team (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT user_email_is_unique UNIQUE (email),
  CONSTRAINT user_username_is_unique UNIQUE (username)
);
