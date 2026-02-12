varying vec3 vColor;
varying float vFresnel;

void main()
{
    // Enhance brightness for bloom/glow effect
    float brightness = length(vColor);
    
    // Boost the color intensity for neon glow
    vec3 glowColor = vColor * 5.5; // Amplify for bloom
    
    // Use fresnel for transparency - edges glow, center is more transparent
    float alpha = vFresnel * 0.9 + 0.02; // Range from 0.1 to 1.0
    
    gl_FragColor = vec4(glowColor, alpha);
}


