exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // Reference: GitHub limit is 39 characters for username.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Reference: RFC 5321 limit is 254 characters for email. https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Reference: bcrypt limit is 72 bytes for password. https://stackoverflow.com/a/6832446
    // https://security.stackexchange.com/a/39851
    password: {
      type: "varchar(72)",
      notNull: true,
    },

    //Reference: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
