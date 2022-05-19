export class Comment {
  comment_id: string = "";
  comment_content: string = "";
  date: string = ""
  deleted: boolean = false;
  parent_is_post: boolean = false;
  parent_post_id: string | undefined = undefined;
  parent_comment_id: string | undefined = undefined;
  upvotes: number = 0;
  author_name: string = "";
  author_id: string = "";
  constructor(
    comment_id: string,
    comment_content: string,
    date: string,
    deleted: boolean,
    parent_is_post: boolean,
    parent_post_id: string | undefined,
    parent_comment_id: string | undefined,
    upvotes: number,
    author_name: string,
    author_id: string
  ) {
    this.comment_id = comment_id;
    this.comment_content = comment_content;
    this.date = date;
    this.deleted = deleted;
    this.parent_is_post = parent_is_post;
    this.parent_post_id = parent_post_id;
    this.parent_comment_id = parent_comment_id;
    this.upvotes = upvotes;
    this.author_name = author_name;
    this.author_id = author_id;
  }
}
