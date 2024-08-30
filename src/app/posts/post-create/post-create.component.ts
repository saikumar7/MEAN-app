import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {

  post: Post = {
    id: '',
    title: '',
    content: '',
    imagePath: '',
    creator: ''
  }
  postForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  imagePreview: string = '';
  constructor(
    private postsService: PostsService,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', Validators.required],
      image: ['', {Validator: [Validators.required], asyncValidator:[mimeType]}]
    })
    const id = this.activateRoute.snapshot.paramMap.get('id');

    if(id) {
      this.isLoading = true;
      this.postsService.getPost(id).subscribe(postData => {
        const pt = {
          id: postData._id,
          title: postData.title,
          content: postData.content,
          imagePath: postData.imagePath,
          creator: postData.creator
        }
        this.post = pt;
        // this.postForm.patchValue(this.post);
        this.postForm.setValue({
          title: this.post.title,
          content: this.post.content,
          image: this.post.imagePath
        })
        this.isLoading = false;
      })
     
    }
  }

  public onImagePicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const file =  input.files ? input.files[0] : '';

    this.postForm.patchValue({image: file});
    this.postForm.get('image')?.updateValueAndValidity();
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  public addPost(): void {
    if(this.postForm.invalid) {
      return;
    }

    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.isLoading = true;
    if(id) {
      this.postsService.updatePost(id, this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
    } else {
      this.postsService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
    }

    this.postForm.reset()   
  }
}
