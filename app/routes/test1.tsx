import { useEffect, useState } from "react";
import PreviewEditor from "~/components/Editor/PreviewEditor";
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";
import EditorWrapper from "~/components/Editor/EditorWrapper";

export default function Editor() {
	return <EditorWrapper />;
}

export const XPreviewEditor = ({
	loadSaveText,
}: {
	loadSaveText: () => Promise<string>;
}) => {
	const [editorState, setEditorState] = useState<string>();
	const [toc, setToc] = useState<
		{
			toc: TableOfContentsEntry;
			scrollIntoView: () => void;
			isActive: () => boolean;
		}[]
	>([]);
	const [curTocIndx, setCurTocIndx] = useState<number>(-1);
	const [previewMode, setPreviewMode] = useState<boolean>(false);

	// const loadSaveText = async () => {
	// 	// Add artifical Delay to simulate network request
	// 	// const val = window.localStorage.getItem("edState") || undefined;
	// 	const v = await fetch("/mock/homeContent.json");
	// 	return JSON.stringify(await v.json());
	// };

	useEffect(() => {
		document.addEventListener("scroll", () => {
			for (const [indx, { isActive }] of toc.entries()) {
				if (isActive()) {
					setCurTocIndx(indx);
					break;
				}
			}
		});
		return () => document.removeEventListener("scroll", () => {});
	}, [toc]);

	return (
		<div className="m-auto w-full max-w-100vw bg-gray-50 border border-gray-300 rounded-md shadow-md p-8">
			<PreviewEditor
				initEditorStateLoader={loadSaveText}
				tableOfContentSetter={(
					list: {
						toc: TableOfContentsEntry;
						scrollIntoView: () => void;
						isActive: () => boolean;
					}[],
				) => setToc(list)}
			/>
		</div>
	);
};
