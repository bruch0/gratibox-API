CREATE TABLE "users" (
	"id" serial NOT NULL,
	"subscription_id" integer,
	"name" varchar(255) NOT NULL,
	"subscription_date" varchar(50),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"zipcode" varchar(8) NOT NULL,
	"street" varchar(255) NOT NULL,
	"city_id" integer NOT NULL,
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
	"rating_id" integer NOT NULL,
	"rating_comment" varchar(255) NOT NULL,
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

CREATE TABLE "cities" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"state_id" integer NOT NULL,
	CONSTRAINT "cities_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "states" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "states_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("city_id") REFERENCES "cities"("id");

ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_fk1" FOREIGN KEY ("rating_id") REFERENCES "ratings"("id");

ALTER TABLE "requested_items" ADD CONSTRAINT "requested_items_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "requested_items" ADD CONSTRAINT "requested_items_fk1" FOREIGN KEY ("item_id") REFERENCES "items"("id");

ALTER TABLE "cities" ADD CONSTRAINT "cities_fk0" FOREIGN KEY ("state_id") REFERENCES "states"("id");
