export class Subreddit {
  subName = "";
  subId = "";
  subOwnerId = "";
  members = 0;
  description = "";
  backgroundUrl = "";
  iconUrl = "";
  constructor(
    subName: string,
    subId: string,
    subOwnerId: string,
    members: number,
    description: string,
    backgroundUrl: string,
    iconUrl: string
  ) {
    this.subName = subName;
    this.subId = subId;
    this.subOwnerId = subOwnerId;
    this.members = members;
    this.description = description;
    this.backgroundUrl = backgroundUrl;
    this.iconUrl = iconUrl;
    
  }
}
