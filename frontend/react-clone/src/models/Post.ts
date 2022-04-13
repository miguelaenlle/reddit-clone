export class Post {
  id = "";
  title = "";
  subName = "";
  opName = "";
  postDate: Date | null = null;
  initialUpvotes = 0;
  numComments = 0;
  constructor(
    id: string,
    title: string,
    subName: string,
    opName: string,
    postDate: Date,
    initialUpvotes: number,
    numComments: number
  ) {
    this.id = id;
    this.title = title;
    this.subName = subName;
    this.postDate = postDate;
    this.opName = opName;
    this.initialUpvotes = initialUpvotes;
    this.numComments = numComments;
  }
}
