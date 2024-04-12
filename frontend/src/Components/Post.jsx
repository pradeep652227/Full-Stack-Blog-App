import React from "react";
export default function Post() {
  return (
    <div id="create-post-div" className="py-8">
      <h1 className="text-3xl text-center mb-2">Create A Post!!</h1>
      <form className="space-y-4 w-full px-12">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="block w-full border-2 rounded-lg p-2 text-lg"
        />
        <label htmlFor="file" className="font-medium">Cover Image:- </label>
        <input id="file" type="file" name="file" accept="image/*"  />
        <textarea
          name="content"
          rows="4"
          placeholder="Content"
          className="block w-full border-2 p-2 rounded-md"
        ></textarea>
        <button className="block w-96 mx-auto border-2 p-2 rounded-xl text-3xl bg-slate-400 hover:bg-slate-200 duration-200">
          Go Live
        </button>
      </form>
    </div>
  );
}
