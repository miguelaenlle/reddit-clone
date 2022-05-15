export class Subreddit {
  subName = "";
  subId = "";
  subOwnerId = "";
  members = 0;
  description = "";
  constructor(
    subName: string,
    subId: string,
    subOwnerId: string,
    members: number,
    description: string
  ) {
    this.subName = subName;
    this.subId = subId;
    this.subOwnerId = subOwnerId;
    this.members = members;
    this.description = description;
  }
}
