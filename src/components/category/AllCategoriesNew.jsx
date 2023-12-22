import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";

const AllCategoriesNew = () => {
	const navigate = useNavigate();
    const { isSmScreen } = useResponsive();

    const category = useSelector((state) => state.shop.shop.category);
    const sections = useSelector((state) => state.shop.shop.sections);
    let finalCategoryList = [];
    for(let i=0; i<category.length; i++){
        if(category[i].has_active_child){
            let all_active_childs = category[i].all_active_childs;
            for(let j=0; j<all_active_childs.length; j++){
                for(let k=0; k<sections.length; k++){
                    if(all_active_childs[j].name.toLowerCase() === sections[k].title.toLowerCase()){
                        let categoryToAdd = {
                            id: sections[k].id,
                            parent_id: all_active_childs[j].parent_id,
                            image_url: all_active_childs[j].image_url,
                            name: all_active_childs[j].name
                        };
                        finalCategoryList.push(categoryToAdd);
                    }
                }
            }
        }
    }
    finalCategoryList.sort((a,b) => {
        if(a.name < b.name){
            return -1
        }else if(a.name > b.name){
            return 1
        }
        return 0;
    });

    return (
        <div style={{paddingTop: isSmScreen ? "" : "70px"}}>
            <div className="px-4 pt-4 pb-2">
                <h1 style={{fontSize: "24px"}}>All Categories</h1>
                <hr/>
            </div>
            <div className="d-grid" style={{gridTemplateColumns: isSmScreen ? "1fr 1fr" : "1fr 1fr 1fr 1fr"}}>
                {
                    finalCategoryList.map((ctg,index)=> (
                        <div key={index} className="d-flex flex-column border rounded-3 m-4 p-2" onClick={(e)=>{
                            navigate(`/subCategory/${ctg.parent_id}/${ctg.id}_${ctg.name}`);
                        }}>
                            <div className="d-flex align-items-center" style={{height: '90%'}}>
                                <img src={ctg.image_url} alt={ctg.name} className="w-100"/>
                            </div>
                            <h2 className="py-2">{ctg.name}</h2>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default AllCategoriesNew;