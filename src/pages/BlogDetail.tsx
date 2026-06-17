import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { blogs } from "@/data/blogs";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogs.find((b) => b.slug === slug);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).MathJax) {
      // Small timeout to allow React to update the DOM before MathJax runs
      setTimeout(() => {
        (window as any).MathJax.typesetPromise?.();
      }, 100);
    }
  }, [post]);


  if (!post) {
    return (
      <div className="blog-post">
        <div className="blog-post__container">
          <Link to="/" className="blog-post__back">
            ← Back Home
          </Link>
          <h1 className="blog-post__not-found">Blog post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <div className="blog-post__container">
        <Link to="/" className="blog-post__back">
          ← Back
        </Link>

        <header className="blog-post__header">
          <h1 className="blog-post__title">{post.title}</h1>
          <time className="blog-post__date">{post.date}</time>
        </header>

        <article className="blog-post__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
