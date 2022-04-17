export class User {
  userId = "";
  username = "";
  upvotes = 0;
  constructor(userId: string, username: string, upvotes: number) {
    this.userId = userId;
    this.username = username;
    this.upvotes = upvotes;
  }
}
