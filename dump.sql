CREATE TABLE "users" (
	"id" serial NOT NULL,
	"subscription_id" integer,
	"name" varchar(255) NOT NULL,
	"subscription_date" varchar(50),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"zipcode" varchar(8),
	"number" integer,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "subscriptions" (
	"id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "deliverys" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"scheduled_date" varchar(100) NOT NULL,
	"rating_id" integer,
	"rating_comment" varchar(255),
	"date_id" integer NOT NULL,
	CONSTRAINT "deliverys_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "ratings" (
	"id" serial NOT NULL,
	"name" varchar(20) NOT NULL,
	CONSTRAINT "ratings_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "requested_items" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	CONSTRAINT "requested_items_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "items" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "delivery_dates" (
	"id" serial NOT NULL UNIQUE,
	"date" varchar(10) NOT NULL,
	CONSTRAINT "delivery_dates_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"token" varchar(255),
	"user_id" integer NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");

ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_fk1" FOREIGN KEY ("rating_id") REFERENCES "ratings"("id");
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_fk2" FOREIGN KEY ("date_id") REFERENCES "delivery_dates"("id");

ALTER TABLE "requested_items" ADD CONSTRAINT "requested_items_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "requested_items" ADD CONSTRAINT "requested_items_fk1" FOREIGN KEY ("item_id") REFERENCES "items"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

INSERT INTO items (name) VALUES ('Chá');
INSERT INTO items (name) VALUES ('Produtos orgânicos');
INSERT INTO items (name) VALUES ('Incensos');

INSERT INTO delivery_dates (date) VALUES ('01');
INSERT INTO delivery_dates (date) VALUES ('10');
INSERT INTO delivery_dates (date) VALUES ('20');
INSERT INTO delivery_dates (date) VALUES ('monday');
INSERT INTO delivery_dates (date) VALUES ('wednesday');
INSERT INTO delivery_dates (date) VALUES ('friday');

INSERT INTO subscriptions (name) VALUES ('monthly');
INSERT INTO subscriptions (name) VALUES ('weekly');
