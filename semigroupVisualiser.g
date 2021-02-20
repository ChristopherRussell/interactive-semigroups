# We will be storing D/R/L/H-classes as lists of pointers to the position of their elements
# in Elements(S)
S := FullTransformationMonoid(4);;
degree := DegreeOfTransformationSemigroup(S);;
D := List(GreensDClasses(S), Elements);;
D_ranks := List(D, d -> RankOfTransformation(Representative(d), degree));
D := List(D, d -> List(d, e -> Position(Elements(S), e)));;
R := List(GreensDClasses(S), GreensRClasses);;
R_kernels := List(R, d -> List(d, r -> KernelOfTransformation(Representative(r), degree)));
R := List(R, d -> List(d, r -> List(r, e -> Position(Elements(S), e))));;
L := List(GreensDClasses(S), GreensLClasses);;
L_images := List(L, d -> List(d, l -> ImageSetOfTransformation(Representative(l), degree)));
L := List(L, d -> List(d, l -> List(l, e -> Position(Elements(S), e))));;


# Now we store H-classes in a particular order so that if we fill out the rows of a
# D-class diagram from left to right and top to bottom the H-classes with the same
# image set will be in the same column and those with the same kernel will be in the
# same row. We also create a corresponding list with the structure description of
# the group H-classes.
compareHClasses := function(h1, h2, kers, ims)
    local im1, im2, ker1, ker2;
    im1  := ImageSetOfTransformation(Representative(h1));
    im2  := ImageSetOfTransformation(Representative(h2));
    ker1 := KernelOfTransformation(Representative(h1));
    ker2 := KernelOfTransformation(Representative(h2));
    return [Position(kers, ker1), Position(ims, im1)] <
     [Position(kers, ker2), Position(ims, im2)];
end;
H := [];
for i in [1 .. Length(D)] do
    H[i] := ShallowCopy(GreensHClasses(GreensDClasses(S)[i]));
    comp := function(h1, h2)
        Print(h1, h2);
        return compareHClasses(h1, h2, R_kernels[i], L_images[i]);
    end;
    Sort(H[i], comp);
od;
structure := function(h)
    if IsGroupHClass(h) then
        return StructureDescription(h);
    else
        return "";
    fi;
end;
H_groups := List(H, d -> List(d, structure));
H := List(H, d -> List(d, h -> List(h, e -> Position(Elements(S), e))));

# store ideals as lists of pointers to the elements they contain
ideals := List(Ideals(S), i -> List(i, e -> Position(Elements(S), e)));


# We will want to export the transformations as image lists, rather than
# transformation objects.
elm := List(Elements(S), e -> ImageListOfTransformation(e, 3));;


# Exporting semigroup data as a javascript object.
f := IO_File("/Users/crussell/Desktop/Semigroup_Visualiser/semigroupData.js", "w");;
out := Concatenation("export let semigroup = { D:", String(D), "\n",
       ", R:", String(R), "\n",
       ", L:", String(L), "\n",
       ", H:", String(H), "\n",
       ", elm:", String(elm), "\n",
       ", D_ranks:", String(D_ranks), "\n",
       ", R_kernels:", String(R_kernels), "\n",
       ", L_images:", String(L_images), "\n",
       ", H_groups:", String(H_groups), "\n",
       ", ideals:", String(ideals),
       " }");
IO_Write(f, out);;
IO_Close(f);;