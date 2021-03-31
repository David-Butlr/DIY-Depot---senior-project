import * as React from "react";
import {
	Typography as MaterialTypography,
	TypographyProps as MaterialTypographyProps,
} from "@material-ui/core";
import { urlRegex } from "../../Models/Utils";

type TypographyProps = {
	text: string;
} & MaterialTypographyProps;

const Typography: React.FC<TypographyProps> = ({
	text,
	...props
}: TypographyProps) => {
	const [stringParts] = React.useState<string[]>(text.split(" "));

	return (
		<MaterialTypography {...props}>
			{stringParts.map((stringPart) => {
				if (urlRegex.test(stringPart)) {
					return (
						<React.Fragment>
							<a
								href={stringPart}
								target="_blank"
								rel="noopener noreferrer"
							>
								link
							</a>
							&nbsp;
						</React.Fragment>
					);
				} else {
					return <React.Fragment>{stringPart} </React.Fragment>;
				}
			})}
		</MaterialTypography>
	);
};

export default Typography;
