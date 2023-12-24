import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home Page",
};

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <section className="body-font text-gray-600">
          <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
            <div className="mb-10 border-b border-gray-200 pb-10 md:mb-0 md:w-1/2 md:border-b-0 md:border-r md:py-8 md:pr-12">
              <h1 className="title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                Pitchfork Kickstarter Taxidermy
              </h1>
              <p className="text-base leading-relaxed">
                Locavore cardigan small batch roof party blue bottle blog
                meggings sartorial jean shorts kickstarter migas sriracha
                church-key synth succulents. Actually taiyaki neutra, distillery
                gastropub pok pok ugh.
              </p>
              <a className="mt-4 inline-flex items-center text-indigo-500">
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <div className="flex flex-col md:w-1/2 md:pl-12">
              <h2 className="title-font mb-3 text-sm font-semibold tracking-wider text-gray-800">
                CATEGORIES
              </h2>
              <nav className="-mb-1 flex list-none flex-wrap">
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Fifth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Sixth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Seventh Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Eighth Link
                  </a>
                </li>
              </nav>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
