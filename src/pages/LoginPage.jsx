import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';

const C = { page:'#FAF3E4', parchment:'#F4E8D0', white:'#FFFDF5', maroon:'#6B0F1A', maroonD:'#4A0A10', maroonL:'#8B1A28', gold:'#B5892E', goldB:'#D4A017', goldL:'#F2C84B', ink:'#1A0800', muted:'#7A6040', border:'#D4BC94', borderL:'#EDE0C8' };

const Lbl = ({t,c=C.muted,s=8}) => <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:s,letterSpacing:'0.45em',textTransform:'uppercase',fontWeight:700,color:c}}>{t}</span>;

function InputField({ label, type='text', value, onChange, placeholder, icon:Icon, right, accent=C.maroon }) {
  const [f,setF] = useState(false);
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
        <Lbl t={label} c={f?accent:C.muted}/>
        {right}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,borderBottom:`1.5px solid ${f?accent:C.border}`,paddingBottom:9,transition:'border-color .25s'}}>
        <Icon size={14} color={f?accent:C.border} style={{flexShrink:0}}/>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'Montserrat',sans-serif",fontSize:13,color:C.ink}}/>
      </div>
    </div>
  );
}

function CredRow({label,value}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:`1px solid ${C.borderL}`}}>
      <Lbl t={label} s={8.5}/><span style={{fontFamily:"'Montserrat',sans-serif",fontSize:12,color:C.ink,fontWeight:600}}>{value}</span>
    </div>
  );
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token, user } = useSelector(s => s.auth);
  const from = location.state?.from?.pathname || '/catalog';
  const [mode, setMode] = useState('patron');
  const [form, setForm] = useState({ email:'', password:'' });
  const [show, setShow] = useState(false);
  const isAdmin = mode === 'admin';

  useEffect(() => {
    if (token && user) navigate(user.role==='admin'||user.role==='staff' ? '/admin' : from, {replace:true});
  }, [token, user, navigate, from]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const switchMode = m => { setMode(m); setForm({email:'',password:''}); setShow(false); dispatch(clearError()); };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.email||!form.password) return toast.error('Please enter your credentials');
    dispatch(login(form));
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',background:C.page,fontFamily:"'Montserrat',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::placeholder{color:${C.border};}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pulse{0%,100%{opacity:.4;}50%{opacity:.8;}}
        .left-panel{display:none;}
        @media(min-width:960px){.left-panel{display:flex!important;}}
        .login-right{padding:clamp(24px,6vw,64px) clamp(20px,5vw,56px);}
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div className="left-panel" style={{width:'46%',minHeight:'100vh',position:'relative',overflow:'hidden',flexDirection:'column',justifyContent:'space-between',background:C.maroonD}}>
        
        {/* BG image */}
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" alt=""
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.18,filter:'grayscale(30%)'}}/>
        <div style={{position:'absolute',inset:0,background:`linear-gradient(160deg,${C.maroonD}F0 0%,${C.maroon}CC 100%)`}}/>
        
        {/* Gold top line */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${C.goldL},transparent)`,zIndex:5}}/>

        {/* Decorative dot grid */}
        <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`radial-gradient(${C.goldL} 1px,transparent 1px)`,backgroundSize:'32px 32px'}}/>

        {/* Logo */}
        <div style={{position:'relative',zIndex:2,padding:'40px 44px 0'}}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
            <div style={{width:36,height:36,border:`1.5px solid ${C.goldL}50`,transform:'rotate(45deg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:16,height:16,background:C.goldL,opacity:0.7,transform:'rotate(0deg)'}}/>
            </div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,letterSpacing:'0.12em',color:'white',fontWeight:700,lineHeight:1}}>
                Tailor<em style={{color:C.goldL,fontStyle:'italic'}}>24</em>
              </div>
              <div style={{fontSize:6,letterSpacing:'0.5em',color:`${C.goldL}60`,textTransform:'uppercase',marginTop:3}}>Central India · Est. 1997</div>
            </div>
          </Link>
        </div>

        {/* Hero copy */}
        <div style={{position:'relative',zIndex:2,padding:'0 44px',flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} transition={{duration:.45}}>
              <div style={{width:48,height:2,background:`linear-gradient(to right,${C.goldL},transparent)`,marginBottom:20,opacity:0.6}}/>
              <p style={{fontSize:9,letterSpacing:'0.55em',color:`${C.goldL}70`,textTransform:'uppercase',marginBottom:16}}>
                {isAdmin ? 'Admin Control Centre' : 'Welcome Back'}
              </p>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(40px,5vw,68px)',color:'white',lineHeight:1,fontWeight:700,marginBottom:24}}>
                {isAdmin ? <>Admin<br/><em style={{color:C.goldL}}>Access.</em></>
                         : <>Your<br/><em style={{color:`${C.parchment}CC`}}>Atelier.</em></>}
              </h2>
              <p style={{fontSize:9.5,color:'rgba(255,255,255,0.35)',lineHeight:1.9,letterSpacing:'0.15em',textTransform:'uppercase',maxWidth:240}}>
                {isAdmin ? 'Manage orders, patrons & atelier operations.' : 'Access your saved measurements and bespoke commissions.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Gold divider line */}
          <div style={{marginTop:40,height:1,background:`linear-gradient(to right,${C.goldL}40,transparent)`}}/>
        </div>

        {/* Stats row */}
        <div style={{position:'relative',zIndex:2,padding:'24px 44px 40px',display:'flex',gap:24,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          {[{n:'20+',l:'Years'},{n:'4k+',l:'Patrons'},{n:'24h',l:'Ready'}].map((s,i)=>(
            <div key={i}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.goldL,fontWeight:700,lineHeight:1}}>{s.n}</div>
            <div style={{fontSize:7,letterSpacing:'0.3em',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',marginTop:3}}>{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>

        {/* Watermark */}
        <div style={{position:'absolute',right:-60,bottom:-60,width:320,height:320,border:`1px solid ${C.border}`,borderRadius:'50%',opacity:0.15,pointerEvents:'none'}}/>
        <div style={{position:'absolute',right:-20,bottom:-20,width:220,height:220,border:`1px solid ${C.gold}`,borderRadius:'50%',opacity:0.08,pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${C.gold}60,transparent)`}}/>

        <motion.div className="login-right" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.22,1,.36,1]}}
          style={{width:'100%',maxWidth:460,position:'relative',zIndex:1}}>

          {/* Mobile logo */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:32,justifyContent:'center'}} className="m-logo">
            <style>{`.m-logo{display:flex;} @media(min-width:960px){.m-logo{display:none!important;}}`}</style>
            <div style={{width:28,height:28,border:`1.5px solid ${C.maroon}60`,transform:'rotate(45deg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:10,height:10,background:C.maroon,opacity:0.8}}/>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,letterSpacing:'0.12em',color:C.ink,fontWeight:700}}>
              Tailor<em style={{color:C.maroon,fontStyle:'italic'}}>24</em>
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{display:'flex',marginBottom:36,background:C.parchment,border:`1px solid ${C.border}`,padding:4,position:'relative'}}>
            {/* Animated slider */}
            <motion.div layout style={{position:'absolute',top:4,bottom:4,width:'calc(50% - 4px)',background:C.maroon,zIndex:0}}
              animate={{left:isAdmin?'calc(50%)'  :'4px'}} transition={{duration:.3,ease:[.22,1,.36,1]}}/>
            {[{id:'patron',l:'Patron Login'},{id:'admin',l:'Admin Access',ic:FiShield}].map(({id,l,ic:Ic})=>(
              <button key={id} onClick={()=>switchMode(id)}
                style={{flex:1,padding:'12px',border:'none',background:'transparent',cursor:'pointer',position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontFamily:"'Montserrat',sans-serif",fontSize:8.5,letterSpacing:'0.3em',fontWeight:700,textTransform:'uppercase',color:mode===id?'white':C.muted,transition:'color .3s'}}>
                {Ic&&<Ic size={10}/>}{l}
              </button>
            ))}
          </div>

          {/* Form header */}
          <AnimatePresence mode="wait">
            <motion.div key={`h-${mode}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.28}} style={{marginBottom:28}}>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(30px,4vw,42px)',color:C.ink,fontWeight:700,lineHeight:1,margin:'0 0 6px'}}>
                {isAdmin?'Admin':'Patron'}
                <em style={{color:C.maroon,fontStyle:'italic'}}> Login</em>
              </h1>
              <div style={{height:1,width:60,background:`linear-gradient(to right,${C.gold},transparent)`,margin:'12px 0'}}/>
              {!isAdmin
                ?<p style={{fontSize:9,letterSpacing:'0.22em',color:C.muted,textTransform:'uppercase'}}>New to the atelier? <Link to="/register" style={{color:C.maroon,fontWeight:700,textDecoration:'underline',textUnderlineOffset:3}}>Enroll Now</Link></p>
                :<p style={{fontSize:9,letterSpacing:'0.2em',color:C.muted,textTransform:'uppercase',display:'flex',alignItems:'center',gap:5}}><FiShield size={9} color={C.gold}/>Restricted — authorised staff only</p>}
            </motion.div>
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form key={`f-${mode}`} onSubmit={handleSubmit}
              initial={{opacity:0,x:isAdmin?16:-16}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{duration:.3,ease:[.22,1,.36,1]}}
              style={{display:'flex',flexDirection:'column',gap:22}}>

              <InputField label={isAdmin?'Staff Email':'Patron Email'} type="email" value={form.email}
                onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                placeholder={isAdmin?'admin@tailor24.com':'patron@example.com'}
                icon={FiMail} accent={C.maroon}/>

              <InputField label="Security Key" type={show?'text':'password'} value={form.password}
                onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                placeholder="••••••••" icon={FiLock} accent={C.maroon}
                right={
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    {!isAdmin&&<button type="button" onClick={()=>{}} style={{fontSize:8,letterSpacing:'0.2em',color:`${C.maroon}70`,background:'none',border:'none',cursor:'pointer',fontFamily:"'Montserrat',sans-serif",textTransform:'uppercase'}}>Forgot?</button>}
                    <button type="button" onClick={()=>setShow(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:C.border,display:'flex',padding:0}}>
                      {show?<FiEyeOff size={14}/>:<FiEye size={14}/>}
                    </button>
                  </div>
                }/>

              {/* Submit */}
              <SubmitBtn loading={loading} isAdmin={isAdmin}/>
            </motion.form>
          </AnimatePresence>

          {/* Credential hint cards */}
          <AnimatePresence mode="wait">
            <motion.div key={`c-${mode}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:.15}}
              style={{marginTop:24,padding:'16px 18px',border:`1px dashed ${isAdmin?C.maroon+'50':C.gold+'50'}`,background:isAdmin?`${C.maroon}06`:C.white,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',right:8,bottom:-4,fontFamily:"'Cormorant Garamond',serif",fontSize:44,color:isAdmin?`${C.maroon}07`:`${C.gold}08`,fontStyle:'italic',lineHeight:1,pointerEvents:'none',userSelect:'none'}}>
                {isAdmin?'Admin':'Demo'}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}>
                {isAdmin?<FiShield size={10} color={C.maroon}/>:null}
                <Lbl t={isAdmin?'Admin Access Credentials':'Patron Demo Credentials'} c={isAdmin?C.maroon:C.gold}/>
              </div>
              <CredRow label="Email" value={isAdmin?'admin@tailor24.com':'demo@tailor24.com'}/>
              <div style={{marginTop:6}}>
                <CredRow label={isAdmin?'Pass':'Secret'} value={isAdmin?'admin1234':'demo1234'}/>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom dots */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:24}}>
            {[0,1,2,1,0].map((s,i)=>(
              <div key={i} style={{width:s===2?8:s===1?5:3,height:s===2?8:s===1?5:3,borderRadius:'50%',background:s===2?C.maroon:C.gold,opacity:s===2?.7:.3}}/>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, isAdmin }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button type="submit" disabled={loading}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)} whileTap={{scale:.98}}
      style={{width:'100%',padding:'16px',background:C.maroon,border:'none',cursor:loading?'not-allowed':'pointer',position:'relative',overflow:'hidden',marginTop:4,opacity:loading?.65:1}}>
      <motion.div animate={{x:hov&&!loading?'0%':'-101%'}} transition={{duration:.4,ease:[.22,1,.36,1]}}
        style={{position:'absolute',inset:0,background:C.maroonD}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${C.goldL}50,transparent)`}}/>
      <span style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
        {loading
          ?<div style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.25)',borderTop:'2px solid white',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
          :<><span style={{fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:'0.5em',fontWeight:700,color:'white',textTransform:'uppercase'}}>
            {isAdmin?'Enter Admin Suite':'Enter Atelier'}
          </span>
          <motion.span animate={{x:hov?5:0}} transition={{duration:.3}}>
            {isAdmin?<FiShield size={14} color="white"/>:<FiArrowRight size={14} color="white"/>}
          </motion.span></>}
      </span>
    </motion.button>
  );
}