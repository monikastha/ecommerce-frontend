import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const PROMOTION_API = `${API}/api/admin/promotions`;
const CATEGORY_API = `${API}/api/productcategory/categories/`;

const AdminUpdatePromotion: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    d_type: "percentage",
    d_value: "",
    applies_to: "all",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchPromotion();
    fetchCategories();
  }, []);

  const fetchPromotion = async () => {

    try {

      const res = await fetch(
        `${PROMOTION_API}/${id}/`
      );

      const data = await res.json();

      if(res.ok){

        setFormData({
          name:data.name,
          d_type:data.d_type,
          d_value:data.d_value || "",
          applies_to:data.applies_to,
          start_date:
          data.start_date?.slice(0,16),

          end_date:
          data.end_date?.slice(0,16),

          status:data.status
        });

        setSelectedCategories(
          data.categories || []
        );

      }

    } catch(err){

      console.log(err);

    }

  };

  const fetchCategories = async()=>{

    const res = await fetch(
      CATEGORY_API
    );

    const data = await res.json();

    setCategories(data);

  };

  const handleChange=(e:any)=>{

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const toggleCategory=(catId:number)=>{

    setSelectedCategories(prev=>

      prev.includes(catId)

      ?

      prev.filter(
        id=>id!==catId
      )

      :

      [...prev,catId]

    );

  };

  const handleSubmit=async(
    e:any
  )=>{

    e.preventDefault();

    setLoading(true);

    const payload={

      ...formData,

      d_value:
      formData.d_value

      ?

      parseFloat(
      formData.d_value
      )

      : null,

      categories:

      formData.applies_to
      ==="category"

      ?

      selectedCategories

      : []

    };

    try{

      const res=await fetch(

      `${PROMOTION_API}/${id}/`,

      {

      method:"PUT",

      headers:{
      "Content-Type":
      "application/json"
      },

      body:
      JSON.stringify(
      payload
      )

      }

      );

      if(res.ok){

      alert(
      "Promotion updated"
      );

      navigate(
      "/admin/promotion"
      );

      } else {
        const data = await res.json().catch(() => null);
        alert(data ? JSON.stringify(data) : "Failed to update promotion");
      }

    }

    catch(err){

    console.log(err);

    }

    setLoading(false);

  };

return(

<>

<div className="layout">

<AdminSidebar/>

<div className="main">

<AdminNavbar/>

<div className="page">

<div className="card">

<h2>
Update Promotion
</h2>

<form
onSubmit={
handleSubmit
}
>

<div className="field">

<label>
Promotion Name
</label>

<input

name="name"

value={
formData.name
}

onChange={
handleChange
}

/>

</div>

<div className="field">

<label>
Discount Type
</label>

<select

name="d_type"

value={
formData.d_type
}

onChange={
handleChange
}

>

<option value="percentage">

Percentage

</option>

<option value="fixed">

Fixed

</option>

</select>

</div>

<div className="field">

<label>
Discount Value
</label>

<input

name="d_value"

value={
formData.d_value
}

onChange={
handleChange
}

/>

</div>

<div className="field">

<label>
Applies To
</label>

<select

name=
"applies_to"

value={
formData.applies_to
}

onChange={
handleChange
}

>

<option value="all">

All Products

</option>

<option value="category">

Category

</option>

</select>

</div>

{formData.applies_to
==="category"

&&(

<div
className=
"field"
>

<label>

Categories

</label>

{categories.map(
(cat)=>(
<label
key={cat.id}
className=
"checkbox"
>

<input

type=
"checkbox"

checked={
selectedCategories.includes(
cat.id
)
}

onChange={()=>

toggleCategory(
cat.id
)

}

/>

{cat.name}

</label>

))

}

</div>

)}

<div className="field">

<label>
Status
</label>

<select

name="status"

value={
formData.status
}

onChange={
handleChange
}

>

<option value="active">

Active

</option>

<option value="inactive">

Inactive

</option>

<option value="expired">

Expired

</option>

</select>

</div>

<div className="field">

<label>
Start Date
</label>

<input

type=
"datetime-local"

name=
"start_date"

value={
formData.start_date
}

onChange={
handleChange
}

/>

</div>

<div className="field">

<label>
End Date
</label>

<input

type=
"datetime-local"

name=
"end_date"

value={
formData.end_date
}

onChange={
handleChange
}

/>

</div>

<div className="btnRow">

<button

type=
"button"

className=
"backBtn"

onClick={()=>

navigate(
"/admin/promotion"
)

}

>

Cancel

</button>

<button

className=
"addBtn"

disabled=
{loading}

>

{

loading

?

"Updating..."

:

"Update"

}

</button>

</div>

</form>

</div>

</div>

</div>

</div>

<style>{`

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:
'Poppins',
sans-serif;
}

.layout{
display:flex;
min-height:100vh;
}

.main{
flex:1;
display:flex;
flex-direction:column;
background:#f4f6f8;
}

.page{
padding:30px;
display:flex;
justify-content:center;
}

.card{

width:100%;

max-width:650px;

background:white;

padding:30px;

border-radius:16px;

box-shadow:
0 8px 20px
rgba(
0,0,0,.06
);

}

h2{
margin-bottom:20px;
}

.field{
margin-bottom:15px;
}

label{

display:block;

font-size:13px;

font-weight:600;

margin-bottom:6px;

}

input,
select{

width:100%;

padding:10px;

border:
1px solid #ddd;

border-radius:10px;

}

.checkbox{

display:flex;

align-items:center;

gap:8px;

margin:6px 0;

width:max-content;

cursor:pointer;

}

.checkbox input{

width:18px;

height:18px;

padding:0;

margin:0;

flex:0 0 18px;

accent-color:#16a34a;

}

.btnRow{

display:flex;

gap:10px;

margin-top:15px;

}

.backBtn{

flex:1;

padding:10px;

background:#e5e7eb;

border:none;

border-radius:10px;

}

.addBtn{

flex:1;

padding:10px;

background:#16a34a;

color:white;

border:none;

border-radius:10px;

}

`}</style>

</>

);

};

export default AdminUpdatePromotion;
