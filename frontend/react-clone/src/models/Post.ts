export class Post {
  id = "";
  title = "";
  text = "";
  subName = "";
  subId = "";
  opName = "";
  opId = "";
  postDate: Date | null = null;
  initialUpvotes = 0;
  numComments = 0;
  constructor(
    id: string,
    title: string,
    text: string,
    subName: string,
    subId: string,
    opName: string,
    opId: string,
    postDate: Date,
    initialUpvotes: number,
    numComments: number
  ) {
    this.id = id;
    this.title = title;
    this.text = text;

    this.subName = subName;

    this.subId = subId;
    this.postDate = postDate;
    this.opName = opName;
    this.opId = opId;
    this.initialUpvotes = initialUpvotes;
    this.numComments = numComments;
  }
}
