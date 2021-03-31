import {
	Grid,
	Typography,
	TextField,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import * as React from "react";
import { API_PATHS } from "../Api";
import { APIResponse } from "../../Models/ApiResponse";
import { Tag } from "../../Models/Tag";
import { appContext } from "../AppContext";

const AdminTags: React.FC = () => {
	const [tags, setTags] = React.useState<Tag[]>([]);
	const [selectedTag, setSelectedTag] = React.useState<Tag | null>(
		() => null
	);
	const [tagText, setTagText] = React.useState<string>(() => "");
	const context = React.useContext(appContext);
	React.useEffect(() => {
		getAllTags();
	}, []);

	const updateTagText = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTagText(e.target.value);

	const getAllTags = () =>
		context.api.get(API_PATHS.TAGS, "/all").then((result: APIResponse) => {
			if (result.status >= 200 && result.status <= 299) {
				setTags(result.data as Tag[]);
			} else {
				context.openError(result.data as string);
			}
		});

	const createTag = async () => {
		try {
			const result = await context.api.post(API_PATHS.ADMIN, "/tag", {
				id: "",
				name: tagText,
			});
			if (result.status >= 200 && result.status <= 299) {
				context.openError("Created Tag");
				setTagText("");
				getAllTags();
			} else {
				context.openError(result.data as string);
			}
		} catch (err) {
			context.openError(err);
		}
	};

	const updateTag = async () => {
		try {
			if (!selectedTag) return;
			const result = await context.api.put(
				API_PATHS.ADMIN,
				`/tag/${selectedTag.id}`,
				selectedTag
			);
			if (result.status >= 200 && result.status <= 299) {
				context.openError("Updated Tag");
				setSelectedTag(null);
				getAllTags();
			} else {
				context.openError(result.data as string);
			}
		} catch (err) {
			console.error(err);
			context.openError("Failed To Delete");
		}
	};

	const deleteTag = (id: string) => {
		context.api
			.delete(API_PATHS.ADMIN, `/tag/${id}`)
			.then((result: APIResponse) => {
				if (result.status >= 200 && result.status <= 299) {
					context.openError("Tag Deleted" as string);
					getAllTags();
				} else {
					context.openError(result.data as string);
				}
			});
	};

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography>Tags</Typography>
			</Grid>
			<Grid item>
				<Grid container spacing={2} direction="row">
					<Grid item>
						<TextField
							label="Tag Name"
							placeholder="Electronics"
							variant="outlined"
							fullWidth
							value={tagText}
							onChange={updateTagText}
						/>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							onClick={createTag}
						>
							Create
						</Button>
					</Grid>
				</Grid>
			</Grid>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell> Tag </TableCell>
							<TableCell align="right"> Edit </TableCell>
							<TableCell align="right"> Delete </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tags.map((tag: Tag) =>
							selectedTag !== null &&
							tag.id === selectedTag.id ? (
								<EditTagTableRow
									key={selectedTag.id}
									tag={selectedTag}
									updateTag={setSelectedTag}
									onSave={updateTag}
									onCancel={() => setSelectedTag(null)}
								/>
							) : (
								<TagTableRow
									key={tag.id}
									tag={tag}
									onEdit={setSelectedTag}
									onDelete={deleteTag}
								/>
							)
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	);
};

type TagTableRowProps = {
	tag: Tag;
	onEdit: (tag: Tag) => void;
	onDelete: (id: string) => void;
};

const TagTableRow: React.FC<TagTableRowProps> = ({
	tag,
	onEdit,
	onDelete,
}: TagTableRowProps) => {
	return (
		<TableRow>
			<TableCell component="th" scope="row">
				{tag.name}
			</TableCell>
			<TableCell align="right">
				<Button
					variant="contained"
					color="primary"
					onClick={() => onEdit(tag)}
				>
					Edit
				</Button>
			</TableCell>
			<TableCell align="right">
				<Button
					variant="contained"
					color="primary"
					onClick={() => onDelete(tag.id)}
				>
					Delete
				</Button>
			</TableCell>
		</TableRow>
	);
};

type EditTagTableRowProps = {
	tag: Tag;
	updateTag: (tag: Tag) => void;
	onSave: () => void;
	onCancel: () => void;
};

const EditTagTableRow: React.FC<EditTagTableRowProps> = ({
	tag,
	updateTag,
	onSave,
	onCancel,
}: EditTagTableRowProps) => {
	const updateTagText = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateTag({
			id: tag.id,
			name: e.target.value,
		});
	};
	return (
		<TableRow>
			<TableCell component="th" scope="row">
				<TextField
					label="Tag Name"
					placeholder="Electronics"
					variant="outlined"
					fullWidth
					value={tag.name}
					onChange={updateTagText}
				/>
			</TableCell>
			<TableCell align="right">
				<Button variant="contained" color="primary" onClick={onSave}>
					Save
				</Button>
			</TableCell>
			<TableCell align="right">
				<Button variant="contained" color="primary" onClick={onCancel}>
					Cancel
				</Button>
			</TableCell>
		</TableRow>
	);
};

export default AdminTags;
