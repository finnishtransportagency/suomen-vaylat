import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';

export const PageTitle = () => {
    document.title = strings.title;

    useAppSelector((state) => state.language);

    return (
        <div></div>
    );
 }

 export default PageTitle;