import RepositoryFilters from '../components/Filters/RepositoryFilters';
import MainLayout from '../components/Layouts/MainLayout';
import RepositoryPreviewList from '../components/Repository/RepositoryPreviewList';
import RepositoryPreviewSkeletonLoader from '../components/Skeleton Loaders/RepositoryPreviewSkeletonLoader';
import Button from '../components/UI/Button/Button';
import { useGetRepositoriesQuery } from '../lib/graphql-types';

const Explore = () => {
  const { loading, data, error, fetchMore, refetch, networkStatus } =
    useGetRepositoriesQuery({ notifyOnNetworkStatusChange: true });
  const repositories = data?.repositories.edges;
  const repositoriesPageInfo = data?.repositories.pageInfo;
  const repositoriesLoadMoreHandler = () => {
    if (!repositoriesPageInfo.hasNextPage) return;

    fetchMore({
      variables: {
        after: repositoriesPageInfo.endCursor,
      },
    });
  };

  if (error)
    return (
      <MainLayout>
        <div className="flex flex-col space-y-6 items-center justify-center">
          <h1 className="text-7xl font-bold text-red-500">خطا در بارگیری!</h1>
          <span className="text-3xl">
            لطفا چند لحظه بعد دوباره امتحان کنید.
          </span>
          <Button.Primary
            disabled={loading}
            onClick={() => {
              refetch();
            }}
          >
            امتحان مجدد
          </Button.Primary>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-8 pt-4 px-6 pb-6 gap-6">
        <div className="md:col-span-3 lg:col-span-2">
          <RepositoryFilters onApply={refetch} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:col-span-5 lg:col-span-6 auto-rows-min">
          {/* // Network status 4 is when refetch gets called and network status 3 is for when fetchMore gets called
          // In this case we don't want skeleton loaders to appear when the user is trying to load more data
          // So it checks if it's 4 */}
          {loading && networkStatus !== 3 ? (
            <>
              {[...Array(6).keys()].map((number) => (
                <RepositoryPreviewSkeletonLoader key={number} />
              ))}
            </>
          ) : data.repositories.edges.length ? (
            <RepositoryPreviewList
              repositories={repositories}
              onLoadMore={repositoriesLoadMoreHandler}
            />
          ) : (
            <div>
              <h1 className="text-2xl font-semibold mb-4">
                نتیجه ای یافت نشد.
              </h1>
              <span>هیچ نتیجه ای با فیلتر های وارد شده یافت نشد.</span>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
