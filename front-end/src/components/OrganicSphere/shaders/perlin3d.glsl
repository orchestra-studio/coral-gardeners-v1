// Compact classic-like 3D noise
vec4 permute3(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float perlin3(vec3 P){
  vec3 Pi0=floor(P), Pi1=Pi0+1.0;
  Pi0=mod(Pi0,289.0); Pi1=mod(Pi1,289.0);
  vec3 Pf0=fract(P), Pf1=Pf0-1.0;
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=vec4(Pi0.zzzz);
  vec4 iz1=vec4(Pi1.zzzz);
  vec4 ixy=permute3(permute3(ix)+iy);
  vec4 ixy0=permute3(ixy+iz0);
  vec4 ixy1=permute3(ixy+iz1);
  vec4 gx0=ixy0/7.0; vec4 gy0=floor(gx0)/7.0; gx0=fract(gx0)-.5; gy0=fract(gy0)-.5;
  vec4 gz0=.75-abs(gx0)-abs(gy0); vec4 sz0=step(gz0,vec4(0.0));
  gx0-=sz0*(step(0.0,gx0)-.5); gy0-=sz0*(step(0.0,gy0)-.5);
  vec4 gx1=ixy1/7.0; vec4 gy1=floor(gx1)/7.0; gx1=fract(gx1)-.5; gy1=fract(gy1)-.5;
  vec4 gz1=.75-abs(gx1)-abs(gy1); vec4 sz1=step(gz1,vec4(0.0));
  gx1-=sz1*(step(0.0,gx1)-.5); gy1-=sz1*(step(0.0,gy1)-.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
  float n000=dot(g000,Pf0);
  float n100=dot(g100,vec3(Pf1.x,Pf0.y,Pf0.z));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110=dot(g110,vec3(Pf1.x,Pf1.y,Pf0.z));
  float n001=dot(g001,vec3(Pf0.x,Pf0.y,Pf1.z));
  float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.y,Pf1.z));
  float n111=dot(g111,vec3(Pf1.x,Pf1.y,Pf1.z));
  vec3 fade_xyz=Pf0*Pf0*Pf0*(Pf0*(Pf0*6.0-15.0)+10.0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
  vec2 n_y=mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_x=mix(n_y.x, n_y.y, fade_xyz.x);
  return n_x;
}