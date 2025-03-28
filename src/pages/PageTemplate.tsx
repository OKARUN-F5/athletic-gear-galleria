
import React from 'react';

interface PageTemplateProps {
  title: string;
  children: React.ReactNode;
}

const PageTemplate = ({ title, children }: PageTemplateProps) => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div className="prose max-w-none">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
