import { toast } from 'sonner';
import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';

import { paths } from 'src/routes/paths';

import treebuilder from 'src/utils/flat-array-tree-builder';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategories, useDeleteCategory } from 'src/actions/dashboard/category';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const CategoryTree = ({ dataTree, onDelete }) =>
  dataTree.map((item) => (
    <TreeItem
      itemId={item.id.toString()}
      key={item.id}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left side: Image + Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.thumbnail_url ? (
              <Avatar
                src={item.thumbnail_url} // assuming your serializer returns full URL
                alt={item.name}
                sx={{ width: 40, height: 40 }}
                variant="rounded"
              />
            ) : (
              <Avatar sx={{ width: 40, height: 40 }} variant="rounded">
                {item.name[0].toUpperCase()}
              </Avatar>
            )}
            <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
          </Box>
          {/* Right side: Actions */}
          <Box>
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={20} height={20} />
            </Button>
            <Button size="small" component={Link} to={paths.dashboard.category.edit(item.id)}>
              <Iconify icon="solar:pen-bold" width={20} height={20} />
            </Button>
            <Button
              size="small"
              component={Link}
              to={`${paths.dashboard.category.new}?parentCategory=${item.id}`}
            >
              <Iconify icon="mingcute:add-line" />
            </Button>
          </Box>
        </Box>
      }
    >
      {item.children.length > 0 && <CategoryTree dataTree={item.children} onDelete={onDelete} />}
    </TreeItem>
  ));

const CategoryList = () => {
  const { categories, categoriesIsLoading, categoriesError } = useGetCategories();

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    if (categoriesError) toast.error(categoriesError.message);
  }, [categoriesError]);

  // State for expanded items (all expanded by default)
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    if (!categoriesIsLoading && categories) {
      const allIds = categories.map((category) => category.id.toString());
      setExpandedItems(allIds); // expand all on load
    }
  }, [categoriesIsLoading, categories]);

  const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };
  const { deleteCategory, deleteCategoryLoading, deleteCategoryError } = useDeleteCategory();
  const handleExpandClick = () => {
    if (expandedItems.length === 0 && categories) {
      // expand all
      const allIds = categories.map((c) => c.id.toString());
      setExpandedItems(allIds);
    } else {
      // collapse all
      setExpandedItems([]);
    }
  };

  const requestDeleteCategory = (categoryId) => {
    setConfirmDelete({ open: true, id: categoryId });
  };

  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(confirmDelete.id);
      !deleteCategoryLoading && deleteCategoryError
        ? toast.error(deleteCategoryError.message)
        : toast.success('Category deleted successfuly');
      hideConfirmDialog();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDelete.open}
      onClose={hideConfirmDialog}
      title="Delete Category"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteCategory}>
          Delete
        </Button>
      }
    />
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categories List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
        <Button
          onClick={handleExpandClick}
          variant="text"
          startIcon={
            <Iconify
              icon={expandedItems.length === 0 ? 'mingcute:add-line' : 'mingcute:subtract-line'}
              width={18}
              height={18}
            />
          }
        >
          {expandedItems.length === 0 ? 'Expand All' : 'Collapse All'}
          {!categoriesIsLoading && categories.length > 0 ? ` (${categories.length})` : ''}
        </Button>
      </Box>
      <SimpleTreeView
        expandedItems={expandedItems} // ✅ controlled mode
        onExpandedItemsChange={handleExpandedItemsChange}
      >
        {categoriesIsLoading ? (
          <LoadingScreen />
        ) : (
          <CategoryTree dataTree={treebuilder(categories)} onDelete={requestDeleteCategory} />
        )}
      </SimpleTreeView>
      {renderConfirmDialog()}
    </DashboardContent>
  );
};

export default CategoryList;
