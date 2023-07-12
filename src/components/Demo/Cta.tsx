import clsx from 'clsx';

const Cta = ({
  variant = 'standard',
  content,
}: {
  variant: 'standard' | 'highlighted';
  content: 'string';
}) => {
  return (
    <div
      className={clsx(
        {
          '[--cta-bg:var(--secondary)] [--cta-text:white] [--cta-link-text:yellow] [--cta-bullet-color:yellow] [&_a]:!decoration-yellow-200 [&_a]:text-[var(--cta-link-text)] [&_li]:marker:text-[var(--cta-bullet-color)]':
            variant === 'highlighted',
        },
        'bg-[var(--cta-bg)] text-[var(--cta-text)] h-40 p-8 flex justify-center items-center'
      )}
    >
      {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : 'test'}
    </div>
  );
};

export default Cta;
