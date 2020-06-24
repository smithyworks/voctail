COPY users (user_id, name, email, password, premium, admin, refresh_token, last_seen) FROM stdin;
1	Admin	admin@voctail.com	$2b$10$FlXJUpPFgyZqBqvETn7XPeSYFcb9gZ02d.uvbQVxdTe9YS4WjaNLu	t	t	\N	\N
2	Christo	christo@voctail.com	$2b$10$6zHr/452bnmXeP2wXWZu3.C6opMFZEHXwFRGsdcJyeE95ODyNCI5W	t	t	\N	\N
3	Ben	ben@voctail.com	$2b$10$f1FJZaS5kQFt1VLdHvZQk.yswzUALVylNEgG0GeQ0gc1GHGxOhTzq	t	t	\N	\N
4	Clara	clara@voctail.com	$2b$10$K7I/R8cAVmUoYoxHyZ6rBO9TF72xaMh7QerErY34D3i8FN.9b4BD6	t	t	\N	\N
5	Ryan	ryan@voctail.com	$2b$10$u6W2jujWGiCpa3wavl14q./sZTy.TLEdxlzcpGWAwCBmxJJJbwHs.	t	t	\N	\N
\.
ALTER SEQUENCE users_user_id_seq RESTART WITH 6;
