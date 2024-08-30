import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {

  public isUserAuthenticated: boolean = false;
  public userId: string = '';
  posts: Post[] = [];
  private subs!: Subscription;
  private authSub!: Subscription;
  isLoading: boolean = false;
  totalPosts: number = 0;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10, 15]
 
  constructor(private postsService: PostsService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.subs = this.postsService.getPostsUpdatedListener().subscribe(  (postData: {post: Post[], postCount: number}) => {
      this.posts = postData.post;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    })
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthListenerSub().subscribe( val => {
      this.isUserAuthenticated = val;
      this.userId = this.authService.getUserId();
    })
  }

  public onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe( res => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    })
  }

  public onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.authSub.unsubscribe();
  }


}
