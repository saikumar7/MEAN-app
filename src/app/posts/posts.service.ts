import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Post } from '../models/post';
import { map, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/posts/'
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdate = new Subject<{post: Post[], postCount: number}>()

  constructor(private http: HttpClient, private router: Router) { }

  public getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pagesize=${pageSize}&page=${currentPage}`
    this.http.get<{message: string, posts: any[], maxCount: number, creator: string}>(API_URL + queryParam)
    .pipe(map((postData) => {
      return {post: postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator,
        }
      }),
      maxCount: postData.maxCount
    }
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.post;
      this.postsUpdate.next({post: [...this.posts], postCount: transformedPostsData.maxCount});
    })
  }

  public getPostsUpdatedListener() {
   return this.postsUpdate.asObservable();
  }

  public getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(API_URL + id);
  }

  public addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: any}>(API_URL, postData)
    .subscribe((postData) => {
      this.router.navigate(['/']);
    })
  }

  public updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof image == "object") {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id : id,
        title: title,
        content: content,
        imagePath: image,
        creator: ''
    }
  }

    this.http.put<{message: string}>(API_URL + id, postData)
    .subscribe( res => {
      const updatePost = [...this.posts]
      const index = updatePost.findIndex(post => post.id === id);
      this.router.navigate(['/']);
    })
  }

  public deletePost(postId: string) {
    return this.http.delete(API_URL + postId)
  }
}
