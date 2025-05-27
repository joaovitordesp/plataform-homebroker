drop schema if exists platform_trading_db cascade;

create schema platform_trading_db;

create table platform_trading_db.account (
	account_id uuid,
	name text,
	email text,
	document text,
	password text,
	primary key (account_id)
);

create table platform_trading_db.account_asset (
	account_id uuid,
	asset_id text,
	quantity numeric,
	primary key (account_id, asset_id)
);

create table platform_trading_db.order (
	order_id uuid,
	market_id text,
	account_id uuid,
	side text,
	quantity numeric,
	price numeric,
	fill_quantity numeric,
	fill_price numeric,
	status text,
	timestamp timestamptz,
	primary key (order_id)
);

create table platform_trading_db.trade (
	trade_id uuid,
	market_id text,
	buy_order_id uuid,
	sell_order_id uuid,
	side text,
	quantity numeric,
	price numeric,
	timestamp timestamptz,
	primary key (trade_id)
);