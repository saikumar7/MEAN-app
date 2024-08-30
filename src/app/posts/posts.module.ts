import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class PostsModule {}