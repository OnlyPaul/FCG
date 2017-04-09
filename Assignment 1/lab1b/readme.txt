"Light transformations are with respect to the global coordinates."
To be honest, I'm a little bit confused with the phrase, because the global coordinates
could also be moved and rotated. Thus, I'm not quite sure if the light source should be
moved along with the global coordinates when the coordinates are moved.

Therefore, I would infer that the light source moves along with the world. And if any user
moves the light source individually, the transition would be according to the world CS basis.
Which means for example:
    -   transition of world CS -> light moves
    -   transition of the light using (w) -> rotate light source around x-axis of the
        current world CS

Ps. I admit, I failed to switch the light source control to global CS. This version would be
handled exactly like the individual pieces in the former assignment