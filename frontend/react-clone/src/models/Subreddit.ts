export class Subreddit {
  subName = "";
  subId = "";
  members = 0;
  description = "";
  constructor(
    subName: string,
    subId: string,
    members: number,
    description: string
  ) {
    this.subName = subName;
    this.subId = subId;
    this.members = members;
    this.description = description;
  }
}
