import type { Route } from "./+types/home";
import { genPageMetaData } from "~/utils/meta";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Await, data, Link, useAsyncError } from "react-router";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "~/components/ImageCarousel/ImageCarrousel";
import React, {
	type RefObject,
	createRef,
	Suspense,
	useEffect,
	useRef,
	useState,
} from "react";

import { XPreviewEditor } from "./test1";
import CardBulletin from "~/components/CardBulletin/CardBulletin";
import { getNoticeList } from "~/mock/services/fetchMockData";

import "./home.css";
import { FetchError } from "~/types/api/FetchError";
import type { ImageCarouselData, NoticeData } from "~/types/api/resData.type";
import { useXFetcher } from "~/hooks/useXFetcher";
import Home from "~/pages/home/home";
import generateService from "~/service/Service";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({});
	// return [
	// 	{ title: "Manipur Institute of Technology" },
	// 	{
	// 		name: "description",
	// 		content: "Home page for Manipur Institute of Technology",
	// 	},
	// 	{
	// 		name: "og:image",
	// 		itemProp: "image primaryImageOfPage",
	// 		content:
	// 			"https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded",
	// 	},
	// ];
}

export const links: Route.LinksFunction = () => [
	{ rel: "icon", href: "./Manipur_University_Logo.png" },
];

export const clientLoader = async () => {
	// Fetch data separately to handle errors independently
	const imageCarouselPromise = generateService()
		.getImageCarouselContent()
		.catch((error) => {
			console.log("carousel err from loader");
			return { error };
		});

	const noticeListPromise = generateService().getNoticeList();
	// .catch((error) => {
	// 	console.log("notice err from loader");
	// 	return { error };
	// });

	const getHomePageContent = async () => {
		await new Promise((res) => setTimeout(res, 7000));
		const res = await fetch("/mock/homeContent.json");
		const d = await res.json();
		return d;
	};
	const homeContent = getHomePageContent().catch((error) => {
		console.log("home content fetch error");
		return { error };
	});

	return {
		imageCarouseldata: imageCarouselPromise,
		noticeListData: noticeListPromise,
		homeContentData: homeContent,
	};
	// // Wait for both promises to resolve
	// const [imageCarouselResult, noticeListResult] = await Promise.all([
	// 	imageCarouselPromise,
	// 	noticeListPromise,
	// ]);

	// // Return the data and errors using react-router's data utility
	// return data({
	// 	imageCarouseldata: imageCarouselResult.data ?? imageCarouselResult.error,
	// 	noticeListData: noticeListResult.data ?? noticeListResult.error,
	// });
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
	return <Home loaderData={loaderData} />;
}

// export default function Home({ loaderData }: Route.ComponentProps) {
// 	const { imageCarouseldata, noticeListData, homeContentData } = loaderData;
// 	const { state, error, xFetch } = useXFetcher<string>();

// 	const getHomePageContent = async () => {
// 		await new Promise((res) => setTimeout(res, 7000));
// 		const res = await fetch("/mock/homeContent.json");
// 		const d = await res.json();
// 		return JSON.stringify(d);
// 	};

// 	const scrollbarStyle = {
// 		scrollbarWidth: "thin",
// 		scrollbarColor: "#CBD5E0 transparent",
// 		"&::WebkitScrollbar": {
// 			width: "6px",
// 			borderRadius: "20px",
// 		},
// 		"&::WebkitScrollbarTrack": {
// 			background: "transparent",
// 		},
// 		"&::WebkitScrollbarThumb": {
// 			backgroundColor: "#CBD5E0",
// 			borderRadius: "20px",
// 		},
// 	} as const;

// 	return (
// 		<div className="px-0 md:px-2">
// 			{/* <Suspense fallback={<ImageCarouselSkeleton />}>
// 				<Await resolve={data} errorElement={<>An error occured...</>}>
// 					{(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
// 				</Await>
// 			</Suspense> */}

// 			{/* TODO: Add announcememt here and top of page for very important alert/notice */}
// 			<div className="w-full px-1">
// 				<div className="w-full bg-blue-500 text-blue-50 p-1 my-2 text-center font-semibold rounded-md shadow-sm shadow-blue-400">
// 					<Link to={"/xx"} className="inline-block">
// 						Civil Engineering (UG Program) accredited by NBA under Tier-II for
// 						the Academic Year 2020-2021 to 2022-2023 i.e. upto 30-06-2023
// 					</Link>
// 				</div>
// 			</div>

// 			{/* Desktop View */}
// 			<div className="hidden md:grid grid-cols-12 w-full gap-0.5 px-1 relative">
// 				<div
// 					className="col-span-3 space-y-1.5 overflow-y-auto sticky top-[4rem] h-[90vh]"
// 					style={{ ...scrollbarStyle }}>
// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return (
// 										<CardBulletin
// 											cardTitle="Notice"
// 											lists={vals}
// 											moreViewLink="/xxx"
// 											refreshFetcher={getNoticeList}
// 										/>
// 									);
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>
// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return (
// 										<CardBulletin
// 											cardTitle="Notice"
// 											lists={vals}
// 											moreViewLink="/xxx"
// 											refreshFetcher={getNoticeList}
// 										/>
// 									);
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>

// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return <CardBulletin cardTitle="Information" lists={vals} />;
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>
// 				</div>
// 				<div className="col-span-9 min-h-full">
// 					<XPreviewEditor loadSaveText={getHomePageContent} />
// 				</div>
// 			</div>
// 			{/* MobileView */}
// 			<div className="md:hidden w-full relative space-y-2 px-1">
// 				<div className="h-full">
// 					<XPreviewEditor loadSaveText={getHomePageContent} />
// 				</div>
// 				<div className="space-y-2">
// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return (
// 										<CardBulletin
// 											cardTitle="Notice"
// 											lists={vals}
// 											moreViewLink="/xxx"
// 											refreshFetcher={getNoticeList}
// 										/>
// 									);
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>
// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return (
// 										<CardBulletin
// 											cardTitle="Notice"
// 											lists={vals}
// 											moreViewLink="/xxx"
// 											refreshFetcher={getNoticeList}
// 										/>
// 									);
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>

// 					<Suspense fallback={<Skel />}>
// 						<Await resolve={noticeListData}>
// 							{(vals) => {
// 								if (Array.isArray(vals) && vals.length > 0)
// 									return (
// 										<CardBulletin
// 											cardTitle="Information"
// 											lists={vals}
// 											marques={true}
// 										/>
// 									);
// 								else if (Array.isArray(vals) && vals.length === 0)
// 									return (
// 										<EmptyList
// 											detail={"There is no notice to display"}
// 											mssg="No Notice"
// 										/>
// 									);
// 								else return <ErrBnd err={(vals as { error: any }).error} />;
// 							}}
// 						</Await>
// 					</Suspense>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// const Skel = () => {
// 	return (
// 		<div className="w-full max-h-[80vh] md:h-[50vh] border border-gray-300 rounded-md p-2 overflow-y-hidden">
// 			{Array.from({ length: 7 }, (_, i) => (
// 				<div
// 					key={i}
// 					className="w-full h-[4rem] bg-gray-300 my-1 rounded-md animate-bg"
// 					style={{
// 						backgroundImage:
// 							"linear-gradient(90deg, #d1d5dc 0%, #aaa 50%, #d1d5dc 100%)",
// 					}}
// 				/>
// 			))}
// 		</div>
// 	);
// };

// const ErrBnd = ({ err }: { err: unknown }) => {
// 	if (err instanceof FetchError) {
// 		return (
// 			<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
// 				<div className="font-bold text-xl text-rose-600">Error</div>
// 				<div className="font-bold text-4xl text-rose-600 drop-shadow-[0_1.2px_1.2px_rgba(220,38,38,0.8)]">
// 					{err.getStatusCode()}
// 				</div>
// 				<div className="font-semibold text-md text-rose-600">
// 					{err.getStatusText()}
// 				</div>
// 				<div className="text-sm text-rose-600">{err.message}</div>
// 			</div>
// 		);
// 	} else if (err instanceof Error) {
// 		return (
// 			<div className="text-center">
// 				<div className="font-bold">Error </div>
// 				<div>{err.message}</div>
// 			</div>
// 		);
// 	} else {
// 		return (
// 			<div className="text-center">
// 				<div className="font-bold">Error</div>
// 			</div>
// 		);
// 	}
// };

// const EmptyList = ({ mssg, detail }: { mssg: string; detail: string }) => {
// 	return (
// 		<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
// 			<div className="text-md font-bold text-gray-600 drop-shadow-[0_1.2px_1.2px_rgba(100,100,100,0.8)]">
// 				{mssg}
// 			</div>
// 			<div className="text-sm text-gray-400">{detail}</div>
// 		</div>
// 	);
// };

// // const PowerSuspenser: React.FC<{
// // 	children: React.JSX.Element;
// // 	fallBack?: React.JSX.Element;
// // 	errorFallback?: React.JSX.Element;
// // }> = ({
// // 	children,
// // 	fallBack = <>Loading ...</>,
// // 	errorFallback = <>Error...</>,
// // }) => {
// // 	// return <React.Suspense fallback={<></>}>{children}</React.Suspense>;
// // };
