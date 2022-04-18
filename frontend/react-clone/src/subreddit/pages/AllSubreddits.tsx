import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import SubredditsList from "../components/SubredditsList";

const NUM_RESULTS_PER_PAGE = 25;

const AllSubreddits: React.FC<{}> = (props) => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const httpClient = useHttpClient();

  const fetchSubreddits = async (pageNumber: number) => {
    const allSubreddits = httpClient.fetchAllSubreddits(
      pageNumber,
      NUM_RESULTS_PER_PAGE
    );
    return allSubreddits;
  };

  const initializeSubreddits = async () => {
    try {
      const searchResults = await fetchSubreddits(0);
      if (searchResults) {
        setSubreddits(searchResults);
      }
    } catch (error) {}
  };

  const expandSubreddits = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await fetchSubreddits(newPage);
      setSubreddits((prevSubreddits) => [
        ...prevSubreddits,
        ...additionalSearchResults,
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeSubreddits();
  }, []);

  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <div className="p-5">
        <div className="pt-10 z-0 animate-fade relative">
          <div className="space-y-5 animate-fade mb-20">
            <h1 className="text-white text-xl">My Subreddits</h1>
          </div>
          <div className="space-y-5 animate-fade">
            <h1 className="text-white text-xl ">All Subreddits</h1>
            <SubredditsList
              subreddits={subreddits}
              httpIsLoading={httpClient.isLoading}
              page={page}
              resultsPerPage={NUM_RESULTS_PER_PAGE}
              expandSubreddits={expandSubreddits}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllSubreddits;
