import * as React from 'react';
import Giscus from '@giscus/react';

const id = 'inject-comments';

const Comments = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    console.log('in useffect');
    setMounted(true);
  }, []);
  console.log(mounted);

  return (
    <div id={id}>
      {mounted ? (
        <Giscus
          id={id}
          repo="thomasledoux1/website-thomas-astro"
          repoId="R_kgDOH6NmQw"
          category="Announcements"
          categoryId="DIC_kwDOH6NmQ84CXS3y"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          lang="en"
          loading="lazy"
        />
      ) : null}
    </div>
  );
};

export default Comments;
