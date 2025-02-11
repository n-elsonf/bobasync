import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import User from "../src/models/User";

interface UserInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user?: {
    email: string;
    username: string;
    _id: string;
  };
  message?: string;
  error?: string;
}

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    const mongoURI =
      process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test-db";
    await mongoose.connect(mongoURI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    const validUser: UserInput = {
      username: "testuser",
      email: "test@example.com",
      password: "Test123!",
    };

    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(201);
      const body = res.body as AuthResponse;
      expect(body.message).toBe("User registered successfully");
      expect(body.token).toBeDefined();
      expect(body).not.toHaveProperty("password");

      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
      expect(user?.username).toBe(validUser.username);
    });

    it("should not register user with existing email", async () => {
      // Create initial user
      await User.create(validUser);

      // Try to register with same email
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...validUser,
          username: "newuser",
        });

      expect(res.status).toBe(400);
      const body = res.body as AuthResponse;
      expect(body.error).toBe("Email already exists");
    });

    it("should validate required fields", async () => {
      const invalidUser = {
        username: "testuser",
        // missing email and password
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(invalidUser);

      expect(res.status).toBe(400);
      const body = res.body as AuthResponse;
      expect(body.error).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    const validUser: UserInput = {
      username: "testuser",
      email: "test@example.com",
      password: "Test123!",
    };

    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("should login successfully with correct credentials", async () => {
      const loginInput: LoginInput = {
        email: validUser.email,
        password: validUser.password,
      };

      const res = await request(app).post("/api/auth/login").send(loginInput);

      expect(res.status).toBe(200);
      const body = res.body as AuthResponse;
      expect(body.token).toBeDefined();
      expect(body.user).toBeDefined();
      expect(body.user?.email).toBe(validUser.email);
      expect(body.user).not.toHaveProperty("password");
    });

    it("should not login with incorrect password", async () => {
      const loginInput: LoginInput = {
        email: validUser.email,
        password: "WrongPassword123!",
      };

      const res = await request(app).post("/api/auth/login").send(loginInput);

      expect(res.status).toBe(401);
      const body = res.body as AuthResponse;
      expect(body.error).toBe("Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const loginInput: LoginInput = {
        email: "nonexistent@example.com",
        password: validUser.password,
      };

      const res = await request(app).post("/api/auth/login").send(loginInput);

      expect(res.status).toBe(401);
      const body = res.body as AuthResponse;
      expect(body.error).toBe("Invalid credentials");
    });

    it("should validate required fields", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(400);
      const body = res.body as AuthResponse;
      expect(body.error).toBeDefined();
    });
  });
});
