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

    // Reference: bcrypt limit is 60 bytes for password. https://stackoverflow.com/a/6832446
    // https://security.stackexchange.com/a/39851
    // https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    //Reference: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
