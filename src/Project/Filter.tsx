import {
	Checkbox,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@material-ui/core";
import * as React from "react";
import { Tag } from "../../Models/Tag";
import { APIResponse } from "../../Models/ApiResponse";
import { API_PATHS } from "../Api";
import { appContext } from "../AppContext";

type ProjectFilterProps = {
	selectedTags: Tag[];
	setSelectedTags: (tags: Tag[]) => void;
};

const ProjectFilter: React.FC<ProjectFilterProps> = ({
	selectedTags,
	setSelectedTags,
}: ProjectFilterProps) => {
	const [tags, setTags] = React.useState<Tag[]>(() => []);
	const context = React.useContext(appContext);
	React.useEffect(() => {
		getAllTags();
	}, []);

	const getAllTags = () =>
		context.api.get(API_PATHS.TAGS, "/all").then((result: APIResponse) => {
			if (result.status >= 200 && result.status <= 299) {
				setTags(result.data as Tag[]);
			} else {
				context.openError(result.data as string);
			}
		});

	const toggleTag = (tag: Tag) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t.id != tag.id));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};
	return (
		<List>
			<ListSubheader>Filters</ListSubheader>
			{tags.map((tag: Tag) => {
				const labelId = `checkbox-list-label-${tag.name}`;
				return (
					<ListItem
						key={tag.id}
						role={undefined}
						dense
						button
						onClick={() => toggleTag(tag)}
					>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={selectedTags.includes(tag)}
								tabIndex={-1}
								disableRipple
								inputProps={{
									"aria-labelledby": labelId,
								}}
							/>
						</ListItemIcon>
						<ListItemText id={labelId} primary={tag.name} />
					</ListItem>
				);
			})}
		</List>
	);
};

export default ProjectFilter;
