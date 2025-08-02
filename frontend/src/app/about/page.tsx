import AboutPage from "@/components/about";

export default function About() {
  return (
    <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
      <div className="min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <main>
            <AboutPage />
          </main>
        </div>
      </div>
    </div>
  );
}
