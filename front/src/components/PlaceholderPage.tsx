export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
    <h1 className="text-primary text-4xl font-bold">{title}</h1>
    <p className="text-muted-foreground">Strona w budowie...</p>
  </div>
);
